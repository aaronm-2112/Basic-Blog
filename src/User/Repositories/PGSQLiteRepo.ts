import { Pool } from 'pg';
import IRepository from './IRepository';
import IUser from '../IUser';
import User from '../User';
import { UserQueryParameters } from '../UserQueryParameters';

export default class UserPGSQLRepo implements IRepository {

  //the postgresql connection pool
  private pool: Pool;

  constructor() {
    //create the connection pool
    this.pool = new Pool({
      user: 'postgres',
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
        user.userID = row.userID;
        user.setUsername(row.username);
        user.setPassword(row.password);
        user.setEmail(row.email);
        user.setFirstname(row.firstname);
        user.setLastname(row.lastname);
        user.setSalt(row.salt);
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

  async find(username: string): Promise<IUser> {
    return new User();
  }

  async create(user: IUser): Promise<Boolean> {
    try {
      //

    } catch (e) {
      throw new Error(e);
    }
    return true;
  }

  async update(user: IUser): Promise<void> {
    return;
  }

  async delete(email: string): Promise<Boolean> {
    return true;
  }

}