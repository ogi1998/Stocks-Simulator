# Stocks-Simulator
## Description
An app that simulates buying, selling, quoting and tracking stock prices
Technologies used:
- MongoDB for database
- NodeJS (Express) as backened techonology
- JSON Web Tokens for authentication
- EJS, CSS and SCSS for styling

## Running the project
- when running the project u should have nodejs and mongodb installed (if u are using local version or mongodb atlas cloud database connection)
- you should run ``npm i`` to install all packages
- you should have .env file at the root of the project with following configuration:
  - PORT - this should be port of the server you are using
  - DB or DB_ATLAS - this should be connection string for the MongoDB database
  - JWT_SECRET - is a secret string for JWT authentication
    - to generate random string u can use following command in te console: ``require('crypto').randomBytes(64).toString('hex')``
## Demo
- Demo can be found at: https://stocks-simulator.herokuapp.com/
