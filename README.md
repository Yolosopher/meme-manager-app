# Meme Manager App

This is the frontend of the Meme Manager application, built with **React Native**. It provides a mobile-first interface for users to sign up, upload memes, follow users, and like memes in real time.

## Features

- User authentication
- Meme uploads
- Search and follow users
- Like memes
- Real-time notifications with Socket.IO

## Technologies Used

- **React Native**: Mobile app development
- **Expo**: React Native framework for rapid development
- **Socket.IO**: Real-time updates and notifications
- **Axios**: HTTP client for API requests

## Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Yolosopher/meme-manager-app
    cd meme-manager-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the following:

    ```env
    EXPO_PUBLIC_AVATAR_URL="https://uniques.yolosopher.site"
    EXPO_PUBLIC_API_URL={{api_url}}/api
    EXPO_PUBLIC_SOCKET_URL={{api_url}}
    ```

4. **Run the app** (with Expo):
    ```bash
    expo start
    ```

5. **Run on a device or simulator**:
    - Use the QR code to test on your mobile device.
    - Use an emulator or simulator for iOS/Android testing.

## API Integration

This app communicates with the Meme Manager API https://github.com/Yolosopher/meme-manager-api to handle authentication, meme uploads, likes, and follows. All real-time updates (likes/follows) are handled via Socket.IO.

## License

This project is licensed under the MIT License.
