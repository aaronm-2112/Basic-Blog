import ICommentRepository from './ICommentRepository';
import IComment from '../IComment';
import Comment from '../Comment';
import { Pool } from 'pg';
import PGConnection from '../../Common/PGConnection';


export default class CommentPGSQLRepo implements ICommentRepository {

  //the postgresql connection pool
  private pool: Pool;

  constructor(connectionObj: PGConnection) {
    //create the connection pool
    this.pool = new Pool({
      user: connectionObj.getUser(),
      host: connectionObj.getHost(),
      database: connectionObj.getDatabase(),
      password: connectionObj.getPassword(),
      port: connectionObj.getPort()
    });
  }

  //returns comments(replies or top level) ordered by likes or date and cid
  async findAll(blogid: number, reply: boolean, replyTo: number, orderBy: string, likes: number, cid: number, flip: string): Promise<Array<IComment>> {
    try {
      let query: string;
      let queryValues: number[] = [];
      let parameterNumber: number = 0;


      //check if client wants comments from a particular blog
      if (blogid > 0) {
        //add blogid parameter to the base query
        query = `SELECT * FROM comments WHERE blogid = $${parameterNumber += 1} AND `;
        //add the blogid query value
        queryValues.push(blogid);
      } else {
        //construct base query without blogid parameter
        query = `SELECT * FROM comments WHERE `;
      }

      //determine if comment is a reply or a top level comment
      if (reply) {
        //check if requesting replies ordered by date
        if (orderBy === 'date') {
          //check if flip is next
          if (flip === 'next') {
            //-----query returns 10 replies newer than that of the given commentid - which acts as the keyset pagination key in this query
            query = query + `replyto = $${parameterNumber += 1} AND commentid > $${parameterNumber += 1} ORDER BY created ASC, commentid ASC LIMIT 10`;
          } else {
            //------query returns 10 replies older than that of the given commentid
            query = query + `replyto = $${parameterNumber += 1} AND commentid < $${parameterNumber += 1} ORDER BY created ASC, commentid ASC LIMIT 10`;
          }

          //add the query values
          queryValues.push(replyTo);
          queryValues.push(cid);
        } else {//return replies ordered by likes
          //construct query 
          query = query + `replyto = $${parameterNumber += 1} AND (likes, commentid) < ($${parameterNumber += 1}, $${parameterNumber += 1})  ORDER BY likes DESC, commentid DESC LIMIT 10`;
          //add the query values to the query values collection
          queryValues.push(replyTo);
          queryValues.push(likes);
          queryValues.push(cid);
        }
      } else { //return top level comments 
        //check if flip is next or prev
        console.log("In no reply zone");
        if (flip === 'next') {
          //construct query that return top level comments by likes
          query = query + `reply = false AND (likes, commentid) < ($${parameterNumber += 1}, $${parameterNumber += 1})  ORDER BY likes DESC, commentid DESC LIMIT 10`;
        } else {
          //query returning data on the previous page
          query = query + `reply = false AND (likes, commentid) > ($${parameterNumber += 1}, $${parameterNumber += 1})  ORDER BY likes DESC, commentid DESC LIMIT 10`;

        }
        //add the query values
        queryValues.push(likes);
        queryValues.push(cid);
      }

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
        comment.setCommentid(row.commentid);
        comment.setUsername(row.username);
        comment.setBlogid(row.blogid);
        comment.setContent(row.content);
        comment.setReply(row.reply);
        comment.setReplyto(row.replyto);
        comment.setLikes(row.likes);
        comment.setLikedby(row.likedby);
        comment.setDeleted(row.deleted);
        comment.setCreated(row.created);

        //add the comment object to the comments collection
        comments.push(comment);
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
      let query: string = `INSERT INTO comments ( username, blogid, content, reply, replyto, likes, likedby, deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING commentid`;

      //add the comment values
      let values: Array<any> = new Array();
      values.push(comment.username);
      values.push(comment.blogid);
      values.push(comment.content);
      values.push(comment.reply);
      values.push(comment.replyto);
      values.push(comment.likes);
      values.push(comment.likedby);
      values.push(comment.deleted);

      //execute the insertion
      let result = await this.pool.query(query, values);

      //retrieve the last rowID from the result object -- lastID is only populated when we use an insert
      let commentid: number = result.rows[0]["commentid"];

      //returnt the comment id
      return commentid;
    } catch (e) {
      throw new Error(e);
    }
  }

  async find(commentid: number): Promise<IComment> {
    try {
      //create a query to search by id
      let query: string = `SELECT * FROM comments WHERE commentid = $1`;

      //create the query values
      let queryValues: number[] = [];
      queryValues.push(commentid);

      //execute the query
      let result = await this.pool.query(query, queryValues);

      //extract the rows from the result
      let rows: any[] = result.rows;

      if (rows.length < 1) {
        throw new Error("No comment found");
      }

      //traverse the result row and fill in comment values
      let comment: IComment = new Comment();
      rows.forEach(row => {
        comment.setCommentid(row.commentid);
        comment.setUsername(row.username);
        comment.setBlogid(row.blogid);
        comment.setContent(row.content);
        comment.setReply(row.reply);
        comment.setReplyto(row.replyto);
        comment.setLikes(row.likes);
        comment.setLikedby(row.likedby);
        comment.setDeleted(row.deleted);
        comment.setCreated(row.created);
      });

      return comment;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(comment: IComment): Promise<IComment> {
    try {
      //create the update query
      let query: string = `UPDATE comments SET 
                                  username = $1, 
                                  blogid = $2,  
                                  content = $3,
                                  reply = $4,
                                  replyto = $5,
                                  likes = $6,
                                  likedby = $7,
                                  deleted = $8,
                                  created = $9
                                  WHERE commentid = $10 RETURNING *`;

      //fill the query values
      let queryValues: any[] = [];
      queryValues.push(comment.getUsername());
      queryValues.push(comment.getBlogid());
      queryValues.push(comment.getContent());
      queryValues.push(comment.getReply());
      queryValues.push(comment.getReplyto());
      queryValues.push(comment.getLikes());
      queryValues.push(comment.getLikedby());
      queryValues.push(comment.getDeleted());
      queryValues.push(comment.getCreated());
      queryValues.push(comment.getCommentid());

      //execute the query
      let result = await this.pool.query(query, queryValues);

      let row: any = result.rows[0];

      let updatedComment: IComment = new Comment();

      updatedComment.setCommentid(row.commentid);
      updatedComment.setUsername(row.username);
      updatedComment.setContent(row.content);
      updatedComment.setCreated(row.created);
      updatedComment.setDeleted(row.deleted);
      updatedComment.setLikes(row.likes);
      updatedComment.setLikedby(row.likedby);
      updatedComment.setReply(row.reply);
      updatedComment.setReplyto(row.replyto);
      updatedComment.setBlogid(row.blogid);


      return updatedComment;
    } catch (e) {
      throw new Error(e);
    }
  }

  async test(blogid: number, reply: boolean): Promise<Array<IComment>> {
    try {
      //create a query to search by id
      let query: string = `SELECT * FROM comments WHERE blogid = $1 AND reply = $2`;

      //create the query values
      let queryValues: any[] = [];
      queryValues.push(blogid);
      queryValues.push(reply);

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
      });


      //return the results
      return comments;
    } catch (e) {
      throw new Error(e);
    }
  }

}