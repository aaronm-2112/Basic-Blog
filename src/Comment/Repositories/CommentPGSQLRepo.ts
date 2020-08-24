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

  //returns comments(replies or top level) ordered by likes or date and cid
  async findAll(reply: boolean, replyTo: number, orderBy: string, likes: number, cid: number): Promise<Array<IComment>> {
    try {
      let query: string;
      let queryValues: number[] = [];

      //determine if comment is a reply or a top level comment
      if (reply) {
        //construct query that returns replies using the date as the primary means of ordering
        if (orderBy === 'date') {
          query = `SELECT FROM comments * WHERE replyto = $1 AND cid > $2 ORDER BY date ASC, cid ASC LIMIT 10`;
          //add the query values to the query values collection
          queryValues.push(replyTo);
          queryValues.push(cid);
        } else {//return replies ordered by likes
          query = `SELECT FROM comments * WHERE replyto = $1 AND ( likes, cid) < ($2, $3) ORDER BY likes DESC, cid DESC LIMIT 10`;
          //add the query values to the query values collection
          queryValues.push(replyTo);
          queryValues.push(likes);
          queryValues.push(cid);
        }
      } else {
        //construct query that return top level comments 
        query = "";

      }

      //execute the query
      let res = await this.pool.query(query, queryValues);

      //retrieve the results
      let comments: IComment[] = res.rows;

      //return the results
      return comments;
    } catch (e) {
      throw new Error(e);
    }
  }

  //TODO: Make values array more typescript. 
  async create(comment: IComment): Promise<number> {
    try {
      //create the query -- created and cid should be auto-created columns
      let query: string = `INSERT INTO comments username, blogid, content, reply, replyto, likes, deleted created VALUES ($1, $2, $3, $4, $5, $6, $7)`;

      //add the comment values
      let values: any[] = [];
      values.push(comment.username);
      values.push(comment.blogid);
      values.push(comment.content);
      values.push(comment.reply);
      values.push(comment.replyto);
      values.push(comment.likes);
      values.push(comment.deleted);

      //execute the insertion
      let result = await this.pool.query(query, values);

      console.log(result);

      //retrieve the last rowID from the result object -- lastID is only populated when we use an insert
      let cid: number = result.rows[0]["cid"];

      console.log(cid);

      //returnt the comment id
      return cid;
    } catch (e) {
      throw new Error(e);
    }
  }

}