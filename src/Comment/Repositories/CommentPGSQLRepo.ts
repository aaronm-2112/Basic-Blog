import ICommentRepository from './ICommentRepository';
import IComment from '../IComment';
import Comment from '../Comment';
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
        //check if requesting replies ordered by date
        if (orderBy === 'date') {
          //construct query that returns replies using the date as the primary means of ordering
          query = "SELECT FROM comments * WHERE replyto = $1 AND commentid > $2 ORDER BY date ASC, commentid ASC LIMIT 10";
          //add the query values
          queryValues.push(replyTo);
          queryValues.push(likes);
          queryValues.push(cid);
        } else {//return replies ordered by likes
          //construct query 
          query = `SELECT * FROM comments WHERE replyto = $1 AND (likes, commentid) < ($2, $3)  ORDER BY likes DESC, commentid DESC LIMIT 10`;
          //add the query values to the query values collection
          queryValues.push(replyTo);
          queryValues.push(likes);
          queryValues.push(cid);
        }
      } else { //return top level comments not replies
        //construct query that return top level comments by likes
        query = `SELECT * FROM comments WHERE reply = false AND (likes, commentid) < ($2, $3)  ORDER BY likes DESC, commentid DESC LIMIT 10`;
        queryValues.push(likes);
        queryValues.push(cid);
      }



      //THIS WORKS-- get comments by likes
      // query = `SELECT * FROM comments WHERE replyto = $1 AND (likes, commentid) < ($2, $3)  ORDER BY likes DESC, commentid DESC LIMIT 10`
      // queryValues.push(replyTo);
      // queryValues.push(9);
      // queryValues.push(12);

      //execute the query
      let res = await this.pool.query(query, queryValues);

      //retrieve the result rows
      let rows: any[] = res.rows;

      //fill the row values into a comments collection
      let comments: IComment[] = [];

      //fill comments with row values
      rows.forEach(row => {
        //populate a comment object
        let comment: IComment = new Comment();
        comment.commentid = row.commentid;
        comment.username = row.username;
        comment.blogid = row.blogid;
        comment.content = row.content;
        comment.reply = row.reply;
        comment.replyto = row.replyto;
        comment.likes = row.likes;
        comment.deleted = row.deleted;
        comment.created = row.created;

        //add the comment object to the comments collection
        comments.push(comment);
        console.log(row);
      });


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
      let query: string = `INSERT INTO comments ( username, blogid, content, reply, replyto, likes, deleted)  VALUES ($1, $2, $3, $4, $5, $6, $7)`;

      //add the comment values
      let values: Array<any> = new Array();
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
      let commentid: number = result.rows[0]["commentid"];

      console.log(commentid);

      //returnt the comment id
      return commentid;
    } catch (e) {
      throw new Error(e);
    }
  }

}