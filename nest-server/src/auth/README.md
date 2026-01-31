# Auth Module

- This module is responsible for authentication and authorization.
- It provides the following features:
  - User registration via Local, Google and Phone number authentication.
  - Local, Google and Phone number authentication.
  - Provide access_token and refresh_token(`jwt`).


## Auth flow

1. Local 
   1. Registration
      1. /auth/register -> User -> UnverifiedUsers { userId,  trialPeriod: 3d, blockPeriod: 3d }