# OSU Off-Campus Housing Website
A wesbite to enhance stduents experience in seeking for houses, subleasing, and roommates.
## Description
This website is a comprehensive full-stack application featuring JWT user authentication. It integrates housing posts from the official OSU website and enables users to submit their own housing and sublease posts. The platform includes a like feature for roommate searches and a filter functionality to enhance the user experience.
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
- JWT (JSON Wen Token) for user authentication
- MySQL as database.

![signup](https://github.com/user-attachments/assets/f72395f2-dc4c-4204-b787-963f0cfe847b)
