import ICommentRepository from './ICommentRepository';
import IComment from '../IComment';
import { Pool } from 'pg';


export default class CommentPGSQLRepo implements ICommentRepository {

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

  //returns comments(replies or top level) ordered by likes or date
  async findAll(reply: boolean, replyTo: number, orderBy: string): Promise<Array<IComment>> {
    try {
      //
      return new Array<IComment>();
    } catch (e) {
      throw new Error(e);
    }
  }

}