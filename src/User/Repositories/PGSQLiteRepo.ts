import { Pool, Client } from 'pg';
import IRepository from '../IRepository';
import IUser from '../IUser';
import User from '../User';

export default class UserPGSQLRepo implements IRepository {

  private pool = new Pool({
    user: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT as string)
  });

  async findAll(): Promise<IUser[]> {
    this.pool.query('SELECT NOW()', (err, res) => {
      console.log(err, res);
      this.pool.end();
    });
    return new Array<IUser>();
  }
  async find(username: string): Promise<IUser> {
    return new User();
  }

  async create(user: IUser): Promise<Boolean> {
    return true;
  }
  async update(user: IUser): Promise<void> {
    return;
  }
  async delete(email: string): Promise<Boolean> {
    return true;
  }

}