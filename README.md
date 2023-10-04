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
  - DB - this should be connection string for the MongoDB database
  - JWT_SECRET - is a secret string for JWT authentication
    - to generate random string u can use following command in te console: ``require('crypto').randomBytes(64).toString('hex')``
  - API_KEY - this is api key for the stocks API that Im using
    - you can get your api key by going to website: ``https://finnhub.io/dashboard``, creating  your account there, generating your api key and pasting it in `env` file under `API_KEY`
## Demo
- Demo can be found at: https://stocks-simulator.herokuapp.com/ // TODO
