# Rhythmix

Rhythmix is a full-featured music streaming web application built using Node.js, Express, MongoDB, and various other technologies. This README provides an overview of the project, setup instructions, and information on the application's features.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Rhythmix is designed to provide users with an immersive music streaming experience. Users can sign up as listeners or artists, upload tracks, create playlists, and enjoy a rich set of features such as album creation, user subscriptions, and more.

**Note:** The application is yet to be deployed as we are working to improve the frontend with React to make it a single-page application (SPA). The benefits of using React for the frontend include improved performance, faster user interactions, and a more dynamic and responsive user interface.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete tracks
- Create and manage playlists
- Album creation and management
- Subscription plans for users
- Secure handling of user data
- Data sanitization and security measures
- Rate limiting to prevent abuse

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Pug (HTML Templating), CSS, JavaScript
- **Authentication**: JSON Web Tokens (JWT)
- **Payments**: Stripe API
- **Test Data**: Faker.js
- **Bundler**: Parcel

## Installation

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MartinScript/rhythmix.git
   cd rhythmix
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `config.env` file in the root directory and add the following environment variables:

   ```env
   NODE_ENV=development
   DATABASE=<Your MongoDB Connection String>
   DATABASE_PASSWORD=<Your Database Password>
   JWT_SECRET=<Your JWT Secret>
   JWT_EXPIRES_IN=<JWT Expiry Time>
   JWT_COOKIE_EXPIRES_IN=<JWT Cookie Expiry Time>
   STRIPE_SECRET_KEY=<Your Stripe Secret Key>
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Running the Application

- **Start the server:**
  ```bash
  npm start
  ```

### Generating Random Data

- **Insert random data for testing:**
  ```bash
    node ./dev-data/data/import-dev-data.js --import
  ```

## File Structure

```
rhythmix/
├── controllers/
│   ├── albumController.js
│   ├── authController.js
│   ├── errorController.js
│   ├── playlistController.js
│   ├── subscriptionController.js
│   ├── trackController.js
│   ├── uploadController.js
│   ├── userController.js
│   └── viewsController.js
├── dev-data/
│   ├── data/
│   │   ├── generateTestData.js
│   │   └── import-dev-data.json
│   └── uploads/
│       └── audio/
├── models/
│   ├── albumModel.js
│   ├── playlistModel.js
│   ├── subscriptionModel.js
│   ├── trackModel.js
│   └── userModel.js
├── public/
│   ├── css/
│   │   ├── landing-styles.css
│   │   └── style.css
│   ├── js/
│   │   ├── alerts.js
│   │   └── login.js
│   └── img/
├── routes/
│   ├── albumRoutes.js
│   ├── authRoutes.js
│   ├── playlistRoutes.js
│   ├── subscriptionRoutes.js
│   ├── trackRoutes.js
│   ├── userRoutes.js
│   └── viewRoutes.js
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
├── views/
│   ├── base.pug
│   ├── index.pug
│   └── login.pug
├── app.js
├── config.env
├── package-lock.json
├── package.json
└── server.js
```

## API Endpoints

- **User Routes:**

  - `POST /signup`
  - `POST /login`
  - `POST /forgotPassword`
  - `PATCH /resetPassword/:token`
  - `PATCH /updateMyPassword`
  - `PATCH /updateMe`
  - `DELETE /deleteMe`
  - `GET /logout`
  - `GET /me`

- **Track Routes:**

  - `POST /tracks`
  - `GET /tracks`
  - `GET /tracks/:id`
  - `PATCH /tracks/:id`
  - `DELETE /tracks/:id`

- **Album Routes:**

  - `POST /albums`
  - `GET /albums`
  - `GET /albums/:id`
  - `PATCH /albums/:id`
  - `DELETE /albums/:id`

- **Playlist Routes:**

  - `POST /playlists`
  - `GET /playlists`
  - `GET /playlists/:id`
  - `PATCH /playlists/:id`
  - `DELETE /playlists/:id`

- **Subscription Routes:**
  - `GET /subscriptions`

## Troubleshooting

- **Cannot find /bundle.js.map on this server:**
  Verify that the Parcel bundler is correctly configured and running.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## License

This project is licensed under the MIT License.
