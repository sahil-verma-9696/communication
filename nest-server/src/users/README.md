# User Module
This module provide functions that directly interact with the user model(in MongoDB).

## Features

**1. Create User**
   - Create user with (name, email, password) if not then return null.

**2. Update User**
   - Based on user._id update user every details.

**3. Read User**
   **1. Search Users for a user.**
      1.  Get User by id(includes `isFriend` and `directChatId`).

**4. Delete User**