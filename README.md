# Parcel Delivery System

#### • GitHub Repository : https://github.com/jbjzeehad/l2-assignment-5

#### • Live Deployment : https://parceldeliverysystem.vercel.app/

#### • Video Explanation : https://drive.google.com/file/d/1UMSXVK3KMtmzhwp0ark6UzwKzYtp3PM-/view?usp=sharing

## Features

- User roles: `Admin`, `Sender`, `Receiver`
- JWT-based Authentication
- Advanced filtering, search, and pagination
- Parcel creation and delivery tracking
- Status log with timestamps and updater info
- Soft delete and block user/parcel support
- Centralized error handling and validation

## Techstack

- **Typescript**
- **ESLint**
- **MongoDB**
- **Express**
- **Zod**
- **Bcrypt**
- **JWT**
- **Mongoose**
- **Vercel**
- **Git** + **Github**

## Folder Structure

```
└─ src
|  └─ config
|  |  └─ env.ts
|  └─ error
|  |  └─ AppError.ts
|  |  └─ error.interface.ts
|  |  └─ handleCastError.ts
|  |  └─ handleDuplicateError.ts
|  |  └─ handleValidationError.ts
|  |  └─ handleZodError.ts
|  └─ interface
|  |  └─ index.d.ts
|  └─ middleware
|  |  └─ 404NotFound.ts
|  |  └─ checkAuth.ts
|  |  └─ globalErrorHandler.ts
|  |  └─ validateRequest.ts
|  └─ modules
|  |  └─ auth
|  |  |  └─ auth.controller.ts
|  |  |  └─ auth.route.ts
|  |  |  └─ auth.service.ts
|  |  |  └─ auth.validation.ts
|  |  └─ parcel
|  |  |  └─ parcel.constants.ts
|  |  |  └─ parcel.controller.ts
|  |  |  └─ parcel.interface.ts
|  |  |  └─ parcel.model.ts
|  |  |  └─ parcel.route.ts
|  |  |  └─ parcel.service.ts
|  |  |  └─ parcel.validation.ts
|  |  └─ user
|  |  |  └─ user.constants.ts
|  |  |  └─ user.controller.ts
|  |  |  └─ user.interface.ts
|  |  |  └─ user.model.ts
|  |  |  └─ user.route.ts
|  |  |  └─ user.service.ts
|  |  |  └─ user.validation.ts
|  └─ routes
|  |  └─ index.ts
|  |  └─ routes.interface.ts
|  └─ utils
|  |  └─ calculateFee.ts
|  |  └─ Controller.Layer.Helper.ts
|  |  └─ ParcelTrackingId.ts
|  |  └─ QueryBuilder.ts
|  |  └─ sendResponse.ts
|  |  └─ setAuthCookie.ts
|  |  └─ starterAdmin.ts
|  |  └─ userTokens.ts
|  └─ app.ts
|  └─ server.ts
└─ .env
└─ .gitignore
└─ package.json
└─ README.md
└─ tsconfig.json

```

## API Endpoints Overview

The base Api structure is: **<http://localhost:5000/api/v1/>**

### User

- **POST** : **/user/create** - Admin cannot register. They can only be promoted by other Admins.
- **GET** : **/user/:id** - No restriction as long as they are an registered in user.
- **GET** : **/user/get-all** - Only Admins can access. Supports filter, search, pagination,etc.
- **PATCH** : **/user/update/:id** - Protected Route. Only Admins have full access.
- **DELETE** : **/user/delete/:id** - Soft delete. Non Admins can only delete their own account

### Auth

- **POST** : **/auth/login** - Login route that also sets up the cookies for all users.
- **POST** : **/auth/reset-password** - Protected Route to change password.
- **POST** : **/auth/logout** - Removes the cookies on client side.
- **POST** : **/auth/refresh-token** - Gives fresh Access Tokens to users with valid refresh tokens.

### Parcel

- **GET** : **/parcel/get-all/me** - Fetches all the parcels associated with the User.
- **GET** : **/parcel/get-all** - Admin only route. Fetches every single parcel in the system. Supports pagination, filtering , searching,etc.
- **GET** : **/parcel/get/:trackingId** - Fetches a single parcel based on Tracking Id. The parcel has to associated with user, unless they are Admin.
- **PATCH** : **/parcel/update/sender/:trackingId** - Modifies the user's parcel as long as its not Dispatched yet.
- **PATCH** : **/parcel/update/receiver/:trackingId** - Allows Users to confirm delivery or cancel if not dispatched.
- **PATCH** : **/parcel/update/admin/:trackingId** - Admins can update the status of the parcel.
- **DELETE** : **parcel/delete/:trackingId** - Soft deletes Parcels. Only Admins and Senders.
- **POST** : **/parcel/create** - Only Admins and Senders can create parcels.

## User Roles Overview

- **Admin** - Full Access to any parcel or user.
- **Sender** - Request to send a parcel to admins. Limited Parcel update and view their own parcels.
- **Receiver** - Confirm Delivery or Cancel it. Can view their own parcels.

## Setting Up Project

- Set up Environment Variables in .env file in the project root directory.

  ```
      PORT= "your Port"
      DB_URL= "your-mongo-db-url"
      NODE_ENV= "development"
      HASH_SALT= "Salt Number"
      ACCESS_TOKEN_SECRET= "Your Secret"
      ACCESS_TOKEN_EXPIRES_IN= "1d"
      REFRESH_TOKEN_SECRET= "Your Secret"
      REFRESH_TOKEN_EXPIRES_IN= "30d"
      ADMIN_NAME= "fill it as you wish."
      ADMIN_EMAIL= "fill it as you wish."
      ADMIN_PASSWORD= "fill it as you wish."
      ADMIN_ADDRESS= "fill it as you wish."

  ```
