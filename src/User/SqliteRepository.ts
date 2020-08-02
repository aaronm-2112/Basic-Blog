import IRepository from './IRepository';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import IUser from './IUser';
import User from './User';
import { generateUserSalt, generateUserHash } from '../Common/salt';



export default class UserSQLLiteRepo implements IRepository {

  private dbPath = "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db";

  async findAll(): Promise<IUser[]> {
    try {
      // connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      // get all users in the table
      let allUserRows = await db.all(`SELECT * from User`);

      //close the databse connection
      await db.close()

      // create a users array with the resulting user rows
      let users: IUser[] = [];
      let user: IUser = new User();
      allUserRows.forEach(row => {
        user.setEmail(row["email"]);
        user.setBio(row["bio"]);
        user.setFirstname(row["firstname"]);
        user.setLastname(row["lastname"]);
        user.setUsername(row["username"]);
        user.setPassword(row["password"]);
        users.push(user);
      });

      return users;
    } catch (e) {
      throw new Error(e);
    }

  }

  async find(username: String): Promise<IUser> {
    try {
      // connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      // use the email to acquire the user properties
      let row = await db.get(`SELECT * FROM User WHERE username = '${username}'`);

      //close the database
      await db.close();

      // fill out the user object and return it
      let user: IUser = new User();
      user.setEmail(row["email"]);
      user.setBio(row["bio"]);
      user.setFirstname(row["firstname"]);
      user.setLastname(row["lastname"]);
      user.setUsername(row["username"]);
      user.setPassword(row["password"]);
      return user;

    } catch (e) {
      throw new Error(e);
    }
  }

  async create(user: IUser): Promise<Boolean> {
    try {

      //connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //Generate a salt for the user
      let salt: string = await generateUserSalt();

      //set user's salt
      user.setSalt(salt);

      //Generate a hash for the user's password 
      let hash: string = await generateUserHash(user.getPassword(), salt);

      //TODO: Maybe don't do it this way
      user.setPassword(hash);

      // Insert the user properties into the User table
      await db.exec(`Insert INTO User (username, password, email, firstname, lastname, bio, salt) VALUES ('${user.getUsername()}', '${user.getPassword()}', '${user.getEmail()}', '${user.getFirstname()}', '${user.getLastname()}', '${user.getBio()}', '${user.getSalt()}')`);

      //close the db connection
      await db.close();

      //return a success
      return true;

    } catch (e) {
      // TODO: Shows too much information about the database so change the error
      throw new Error(e);
    }
  }

  //Behind firewall -- assume all input is valid at this point but use prepared statements
  //TODO: Allow password and email changes and make more robust
  async update(user: IUser): Promise<void> {
    try {
      //connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      });


      //store blog properties and their respective values that need to be updated
      let queryProperties: string[] = [];
      let queryValues: string[] = [];

      // get the blog object's properties and property values -- each entry is: ['property', 'property value']
      let userEntries = Object.entries(user);

      //traverse the blog's entries
      for (var entry in userEntries) {
        //console.log(userEntries[entry][0] + userEntries[entry][1]);
        //determine which user properties need to be updated -- and do not update those which can't be
        if (userEntries[entry][0] !== 'username' && userEntries[entry][1] !== "" && userEntries[entry][0] !== 'salt' && userEntries[entry][0] !== 'userID' && userEntries[entry][0] !== 'email') { //empty string not acceptable update value
          //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
          queryProperties.push(userEntries[entry][0] + ' = ?');
          //push the blog property value into the list of query values
          queryValues.push(userEntries[entry][1]);
          console.log(userEntries[entry][0] + userEntries[entry][1]);
        }
      }

      //create the update query using the collection of valid user properties
      let query: string = `UPDATE User SET ` + queryProperties.join(',') + ` WHERE username = ?`;

      //prepare the statement
      let statement = await db.prepare(query);

      console.log(query);
      console.log(...queryValues);

      //execute the statement using the collection of corresponding user property values
      let result = await statement.run(...queryValues, user.getUsername());

      console.log(result);

      //let updatedUser: IUser = await this.find(user.getUsername());

      //console.log(updatedUser);

      //finalize the statement
      await statement.finalize();

      //close the database connection
      await db.close();

    } catch (e) {
      console.log(e);
      throw new Error(e);
    }

  }

  async delete(email: string): Promise<Boolean> {
    try {
      //connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //query the database for the given email and delete the match
      await db.exec(`DELETE FROM User WHERE email = '${email}'`);

      await db.close();

      // no database error so return true
      return true;
    } catch (e) {

      throw new Error(e);
    }

  }

}