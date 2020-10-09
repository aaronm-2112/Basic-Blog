# Basic-Blog
Overview
This basic blog is comprised of a simple javascript and handlebars based front end, and a typescript and Express backend that uses PGSQL for the data layer. The project 
also includes a suite of Postman tests, and suites of unit tests created using the Jest framework focused on the project's models and repositories. The project is meant to 
be run on localhost but does take advantage of environment variables to allow the application to run in dev, test, and production databases. The project may be expanded
to run on a registered domain.

How it works
Download the source files then download node modules. Create .env file in the root of the project. Include these variables in the file: DB_HOST, DB_DATABASE, DB_DATABASE_TEST, 
DB_DATABASE_PROD, DB_USER,DB_PASS, DB_PORT, NODE_ENV, NODE_ENV_DEV, NODE_ENV_TEST, NODE_ENV_PROD, BASE_URL and assign them values of your choosing. To run in dev mode type
npm run dev. To run in production type npm run prod. To run tests, type npm run test. NOTE: All three will run on separate databases. From here, things will be ready to go.


Goals for the backend, testing suites, and frontend
1. Backend Goals
  -Security: While not having an option to run the project in a "live" envrionment, the project has basic rate limiting, user authentication(using jwts, though
             as a matter of practice implemented using npm jsonwebtoken rather than a more secure 3rd party api), salted passwords to protect data at rest using bcrypt, 
             cookies(which store the JWTs) are only accessible through HTTP, parameterized queries help prevent sql injection, a basic content security policy is setup to help with 
             XSS(with some unsafe-inline being available for inline styling, but not inline scripting), http requests can only parse query parameters into strings,
             not object, and environment variables are used to hide password information. 
             Notably missing: Production database can still alter the tables, and a good logging implementation. 
    
             

2. Testing Suites

3. Frontend
    -

