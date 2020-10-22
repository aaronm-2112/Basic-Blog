# Basic-Blog
Overview:
This basic blog is comprised of a simple javascript and handlebars based front end, and a typescript and Express backend that uses PGSQL for the data layer. The project 
also includes a suite of Postman tests, and suites of unit tests created using the Jest framework focused on the project's models and repositories. The project is meant to 
be run on localhost but does take advantage of environment variables to allow the application to run in dev, test, and production databases. The project may be expanded
to run on a registered domain.

Functionality:
Create an account. Login. Create a blog. Edit your blog. Search for blogs by username and title. Add comments to blogs. Add replies to comments. Keyset pagination for 
blogs and comments(both top level comments and replies) with ordering available by likes and date for comments. Can also add likes to comments. While not added in the 
frontend of the application, a user can also delete their comment, which changes their comment content to [deleted] but maintanins all other properties(this was done
so replies to a deleted comment can still exist, and has been unit tested). In a similar fashion, support for editing a comment is included and has been tested, but is not
implemented in the frontend. 

How it works:
Download the source files then download node modules. Create .env file in the root of the project. Include these variables in the file: DB_HOST, DB_DATABASE, DB_DATABASE_TEST, 
DB_DATABASE_PROD, DB_USER,DB_PASS, DB_PORT, NODE_ENV, NODE_ENV_DEV, NODE_ENV_TEST, NODE_ENV_PROD, BASE_URL and assign them values of your choosing. To run in dev mode type
npm run dev. To run in production type npm run prod. To run tests, type npm run test. NOTE: All three will run on separate databases. From here, things will be ready to go.


Goals for the backend, testing suites, and frontend
1. Backend Goals
  -Security: While not having an option to run the project in a "live" envrionment, the project has basic rate limiting, user authentication(using jwts, though
             as a matter of practice implemented using npm jsonwebtoken rather than a more secure 3rd party api), salted passwords to protect data at rest using bcrypt, 
             cookies(which store the JWTs) are only accessible through HTTP, parameterized queries help prevent sql injection, a basic content security policy is setup to help                with XSS(with some unsafe-inline being available for inline styling, but not inline scripting), http requests can only parse query parameters into strings,
             not object, and environment variables are used to hide password information. 
             Notably missing: Production database can still alter the tables, and a good logging implementation. 
   -RESTful: The blog is built with RESTful architecture and lands somewhere between Level 2 and Level 3 of the Richardson maturity model.
             Notable elements for improvement: Some resources can be more independent from the underlying data models they happen to very closely mirror in my design. 
                                               Some resource relationship hiearchies built in the design would have been welcome, even though they were not necessary.
  -OOP: Repositories, models, and controllers are based off interfaces that allow for deciding the desired implementation at run time. While some liberties were 
                  taken because this was a smaller project, general design principles, including SOLID, were followed to make the previous claim possible.
              Notable elements for imporvements: DTO and mappers would help frontend to backend interaction. Breaking repository code into smaller units for update
                                                 code in the repositories would increase their unit test-ability. 
  -Database Layer: The database layer avoids repeat data across tables and uses foreign keys to maintain referential integrity. Indices are also used on columns
                   that are essential to keyset pagination of comments and blogs.
                   Notable elements for improvement: The amount of connection pools being used can likely be reworked. The keyset pagination queries for the comment models can 
                   be reworked to limit the amount of HTTP requests the client needs to make to the server.

2. Testing Suites
   -Postman: In order to ensure the API endpoints functioned as expected each resource has a set of tests that are included in the Postman json file in the project.
             Notable elements for improvement: Test setup and structure could use improvement.
   -Unit Tests: Jest unit tests of the models(Comment, Blog, and User) were created to help catch application logic errors. The same is true for tests of the
                repositories, though these tests are a middle ground between unit and integration tests. 
                Notable elements for improvement: The testing suite for the repositories could use more advanced tests of comment and blog pagination.
   

3. Frontend
   The frontend did not have any goals in terms of presentation or design. Consequently, the presentation is spartan and the code is less well designed than the typescript 
   code in the backend. The frontend was made primarily to reinforce that my backend design made "sense" and was usable by a frontend client. 
   
   

After thoughts:
   -Using express-validator would make validating body and query parameters more secure and simple.
   -Make the database connection errors a 500 status code rather than a 400 to be more accurate

