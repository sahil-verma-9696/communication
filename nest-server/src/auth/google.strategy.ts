import { Response } from 'express';
import { google } from 'googleapis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepo } from 'src/users/repos/users.repo';

export type GoogleUserInfo = {
  name: string;
  email: string;
  verified_email: boolean;
  picture?: string;
};

@Injectable()
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

  constructor(private readonly userRepo: UsersRepo) {}

  /**
   * Validate User
   * --------------
   * @description
   * - This function is used to validate `User` based on `auth code`.
   *
   * - If `oauth provider` not give `access_token` for user(means user not registered). Then create user and return `access_token` and `refresh_token`.
   *
   * - If oauth provider give `access_token` for user(means user already registered). Then return `access_token` and `refresh_token`.
   */
  async validate(auth_code: string): Promise<GoogleUserInfo> {
    if (!auth_code) {
      throw new Error('Auth code is required');
    }

    // 1. Exchange auth code for tokens
    const { tokens } = await this.oauth2Client.getToken(auth_code);

    if (!tokens.access_token) {
      throw new InternalServerErrorException(
        'Failed to get access token from Google',
      );
    }

    // 2. Attach tokens to client
    this.oauth2Client.setCredentials(tokens);

    // 3. Fetch user profile
    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });

    const { data: profile } = await oauth2.userinfo.v2.me.get();

    if (!profile || !profile.email || !profile.name || !profile.verified_email)
      throw new InternalServerErrorException(
        'Failed to get user profile from Google',
      );

    return {
      name: profile.name,
      email: profile.email,
      verified_email: profile.verified_email,
      picture: profile.picture!,
    };
  }

  /**
   * Get Consent of User
   * -------------------
   * @description
   * This function redirect to google_consent_page and then redirect to same clients route with `auth code`.
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

  /**
   * Google Mobile Login
   * @deprecated currently Oauth for mobile not supported.
   */
  async googleMobileLogin(idToken: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log(JSON.stringify(payload, null, 4));
  }
}
