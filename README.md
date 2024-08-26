# OSU Off-Campus Housing Website
A wesbite to enhance stduent's experience in seeking for houses, subleasing, and roommates.

## Description
This website is a comprehensive full-stack application featuring JWT user authentication with refrehs token for temporary access. It integrates housing posts from the official OSU website and enables users to submit their own housing and sublease posts. The platform includes a like feature for roommate searches and a filter functionality to enhance the user experience.

## Installation and setup
- Install Node.js
- npm install (install dependencies)
- pip install requests
- pip install beautifulsoup4
- pip install mysql-connector-python

## Usage
- .env 
  - .env file with SECRET_KEY and REFRESH_SECRET_KEY is included in the package. Can customize secret_key for security purposes.
- connection to database
  - Need to input personal information, icluding host, user, password, database, in line 25 main.js and line 63 setup.py files in server directory to connect to your database.
- JWT token duration
  - Can customize JWT tokens duration in main.js in server directory.
  - Customize refresh token in line 19 in unit of days 'd', initial access token in line 76, and refreshed access token in line 367.
- npm run dev
  - To start the server 
- npm start
  - To start the client

## Acknowledgements
- Express.js as back-end server
- React.js as front-end
- JWT (JSON Wen Token) for user authentication, with token and refresh token for temporary access
- MySQL as database.

## Display
- signup page
- ![signup](https://github.com/user-attachments/assets/f72395f2-dc4c-4204-b787-963f0cfe847b)
- main page with housing posts and filters
- <img width="1435" alt="main" src="https://github.com/user-attachments/assets/cbaf9632-849b-42e7-8aee-6a8287ecdd63
- creating a new housing/sublease post
- <img width="1436" alt="post" src="https://github.com/user-attachments/assets/31f20437-3339-4fb5-bb72-cdc9c0beaada">
- profile page with personal information and posts you created and liked
- <img width="1437" alt="profile1" src="https://github.com/user-attachments/assets/c3db7d59-b029-4832-bc50-9be0babd01e7">
- <img width="1437" alt="profile2" src="https://github.com/user-attachments/assets/88519f89-317c-4cf6-a9e4-2dad0b2bde0a">
- users that have liked the same post for roommate matching
- <img width="1438" alt="liked" src="https://github.com/user-attachments/assets/9095d56c-481f-442e-8688-50147b719a33">
