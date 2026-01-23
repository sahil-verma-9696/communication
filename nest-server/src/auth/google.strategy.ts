import { Response } from 'express';
import { google } from 'googleapis';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException } from '@nestjs/common';
import { jwtExpiresInToMs } from 'src/utilities/jwtExpiresToMs';

export class GoogleStrategy {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
   * To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  private oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
  private scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate User
   * --------------
   * @description This function is used to validate user.
   * @returns { void }
   */
  async validate({ auth_code }: { auth_code: string }): Promise<AuthResponse> {
    if (!auth_code) {
      throw new Error('Auth code is required');
    }

    // 1. Exchange auth code for tokens
    const { tokens } = await this.oauth2Client.getToken(auth_code);

    if (!tokens.access_token) {
      throw new Error('Failed to get access token from Google');
    }

    // 2. Attach tokens to client
    this.oauth2Client.setCredentials(tokens);

    // 3. Fetch user profile
    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });

    const { data: profile } = await oauth2.userinfo.v2.me.get();

    if (!profile || !profile.email) {
      throw new Error('Failed to get user profile from Google');
    }

    let user = await this.userService.getUserByEmail(profile.email);

    if (!user) {
      /**
       * If user sign with google for the first time, then create user, password will be email.
       */
      user = await this.userService.create({
        email: profile.email,
        name: profile.name!,
        verified_email: profile.verified_email!,
        avatar: profile.picture!,
        password: profile.email,
      });
    } else {
      /**
       * If user already exists, then update user, verified email will be updated.
       */
      await this.userService.update(user._id.toString(), {
        email: profile.email,
        verified_email: profile.verified_email!,
      });
    }

    /**
     * Prepare token payload
     * --------------
     */
    const payload = {
      sub: user._id.toString(),
      username: user.name,
      email: user.email,
    };

    /**
     * Create token
     * ------------
     */
    const access_token = await this.jwtService.signAsync(payload);

    /**
     * Validate : token creation
     * ------------
     */
    if (!access_token) {
      throw new InternalServerErrorException('Token creation failed');
    }

    /**
     * Prepare response
     * ----------------
     */
    const expiresInMs = jwtExpiresInToMs('7d');

    const response: AuthResponse = {
      token: access_token,
      user,
      expiresIn: String(expiresInMs),
    };

    /**
     * Return response
     * ---------------
     */
    return response;
  }

  async googleMobileLogin(idToken: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log(JSON.stringify(payload, null, 4));
  }

  /**
   * Get Consent of User
   * -------------------
   * @description This function will redirect user to google consent screen.
   * @param { Response } res
   * @returns { void }
   */
  getConsent(res: Response) {
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: this.scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      // Include the state parameter to reduce the risk of CSRF attacks.
      // state: state,
      prompt: 'consent',
    });

    res.redirect(authorizationUrl);
  }
}
