# Stocks-Simulator
## Description
An app that simulates buying, selling, quoting and tracking stock prices
Technologies used:
- MongoDB for database
- NodeJS (Express) as backened techonology
- JSON Web Tokens for authentication
- EJS, CSS and SCSS for styling
- FinnHub Stocks API for Stocks data

## Requirements
  - [Node.js](https://nodejs.org/en/download)
  - [MongoDB Local](https://www.mongodb.com/try/download/community) Or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

## Running the Project
- Clone the repository with command: `git clone https://github.com/ogi1998/Stocks-Simulator.git`
- Install necessary packages with command: `npm install`
- you should have .env file at the root of the project with following configuration (also see `.env.example` file):
  - `DB` - this should be connection string for the MongoDB database
  - `JWT_SECRET` - is a secret string for JWT authentication
    - to generate random string you can do the following:
      - Open console
      - type `node` to open node console
      - type following command : ``require('crypto').randomBytes(64).toString('hex')``
      - copy the key and paste it in `.env` file
  - `API_KEY` - this is API key for the [FinnHub](https://finnhub.io/dashboard) Stocks API, to generate it:
    - Go to [FinnHub](dashboard)
    - Create a free account
    - Generate an API Key
    - Paste it in `.env` file
- run `npm start` to start the application
