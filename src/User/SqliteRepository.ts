import IRepository from './IRepository';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import IUser from './IUser';
import User from '../Models/User';
import { generateUserSalt, generateUserHash } from '../Common/salt';



export default class UserSQLLiteRepo implements IRepository {

  private dbPath = "C:\\Users\\Aaron\\Desktop\\Typescript-Starter\\dist\\blog.db";

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

  async delete(email: string): Promise<Boolean> {
    try {
      //connect to the database
      const db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //query the database for the given email and delete the match
      await db.exec(`DELETE FROM User WHERE email = '${email}'`);

      // no database error so return true
      return true;
    } catch (e) {

      throw new Error(e);
    }

  }

}