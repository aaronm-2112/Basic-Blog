import { Pool } from 'pg';
import IRepository from './IRepository';
import IUser from '../IUser';
import User from '../User';
import { UserQueryParameters } from '../UserQueryParameters';
import { generateUserSalt, generateUserHash } from '../../Common/salt';

export default class UserPGSQLRepo implements IRepository {

  //the postgresql connection pool
  private pool: Pool;

  constructor() {
    //create the connection pool
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT as string)
    });
  }

  async findAll(searchBy: UserQueryParameters, searchValue: string): Promise<IUser[]> {
    try {
      //create a parameterized query
      let query: string = `SELECT * FROM users WHERE ${searchBy} = $1`;

      //prepare the searchValue for use in the query
      let values: Array<string> = new Array<string>();
      values.push(searchValue);

      //execute the query and store the result
      let res = await this.pool.query(query, values);

      //extract the query rows from the result
      let rows: any[] = res.rows;

      //create a collection of users that matches findAll's return type
      let users: IUser[] = [];

      //load the row values into the user collection
      rows.forEach(row => {
        //create a new user and populate its properties
        let user: IUser = new User();
        user.userid = row.userid;
        user.setUsername(row.username);
        user.setPassword(row.password);
        user.setEmail(row.email);
        user.setFirstname(row.firstname);
        user.setLastname(row.lastname);
        //user.setSalt(row.salt);
        user.setProfilePicPath(row.profilepic);

        //push the user into the users collection
        users.push(user);
      });

      //return the resulting query rows
      return users;
    } catch (e) {
      throw new Error(e);
    }
  }

  //TODO: use search criteria and searchby values
  async find(username: string): Promise<IUser> {
    //create the find query
    let query: string = `SELECT * FROM users WHERE username = $1`;

    //create the query values
    let values: Array<string> = new Array();
    values.push(username);

    //execute the query and store the result
    let result = await this.pool.query(query, values);

    //extract the rows from the result
    let rows: any[] = result.rows;

    //create a user object
    let user: IUser = new User();

    // fill out the user object and return it
    rows.forEach(row => {
      user.setEmail(row["email"]);
      user.setBio(row["bio"]);
      user.setFirstname(row["firstname"]);
      user.setLastname(row["lastname"]);
      user.setUsername(row["username"]);
      user.setPassword(row["password"]);
      user.setProfilePicPath(row["profilepic"]);
    });

    //return the user value
    return user;
  }

  async create(user: IUser): Promise<Boolean> {
    try {
      console.log("In create");
      //Generate a salt for the user
      let salt: string = await generateUserSalt();

      //set user's salt
      user.setSalt(salt);

      //Generate a hash for the user's password with the salt
      let hash: string = await generateUserHash(user.getPassword(), salt);

      //set the user's hash 
      user.setPassword(hash);

      //prepare the insertion query
      let query: string = `INSERT INTO users (username, password, email, firstname, lastname, bio, salt, profilepic) VALUES($1, $2, $3, $4, $5, $6, $7, $8);`;

      //prepare the insertion values
      let values: Array<String> = new Array();
      values.push(user.getUsername());
      values.push(user.getPassword());
      values.push(user.getEmail());
      values.push(user.getFirstname());
      values.push(user.getLastname());
      values.push(user.getBio());
      values.push(user.getSalt());
      values.push(user.getProfilePicPath());

      //insert the user into the users table
      await this.pool.query(query, values);

      return true;

    } catch (e) {
      throw new Error(e);
      return false;
    }
  }

  async update(user: IUser): Promise<void> {
    try {
      console.log("In user update");
      //store user properties and their respective values that need to be updated
      let queryProperties: string[] = [];
      let queryValues: string[] = [];

      // get the blog object's properties and property values -- each entry is: ['property', 'property value']
      let userEntries = Object.entries(user);

      //create parameter position indicator
      let parameterNumber: number = 1;

      //traverse the blog's entries
      for (var entry in userEntries) {
        //console.log(userEntries[entry][0] + userEntries[entry][1]);
        //determine which user properties need to be updated -- and do not update those which can't be
        if (userEntries[entry][0] !== 'username' && userEntries[entry][1] !== "" && userEntries[entry][0] !== 'salt' && userEntries[entry][0] !== 'userid' && userEntries[entry][0] !== 'email') { //empty string not acceptable update value
          //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
          queryProperties.push(userEntries[entry][0] + ` = $${parameterNumber}`);
          //push the blog property value into the list of query values
          queryValues.push(userEntries[entry][1]);
          console.log(userEntries[entry][0] + userEntries[entry][1]);

          //increment parameter value
          parameterNumber += 1;
        }
      }

      //create the update query using the collection of valid user properties
      let query: string = `UPDATE users SET ` + queryProperties.join(',') + ` WHERE username = $${parameterNumber}`;

      console.log(query);

      //add the username to the collection of query values
      queryValues.push(user.getUsername() as string);

      //execute the update query
      let result = await this.pool.query(query, queryValues);
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(email: string): Promise<Boolean> {
    return true;
  }

}