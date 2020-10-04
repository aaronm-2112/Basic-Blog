//Purpose: Access the comment objects stored in the data layer. 

import IComment from '../IComment';

export default interface ICommentRepository {
  //returns top level comments ordered by likes, or date
  //supports pagination using likes, cid, and/or created columns
  //TODO: Include previous page functionality
  findAll(blogid: number, reply: boolean, replyTo: number, orderBy: string, likes: number, cid: number, flip: string): Promise<Array<IComment>>;
  create(comment: IComment): Promise<number>; //create comment return the cid
  //find a single comment using its commentid
  find(commentid: number): Promise<IComment>;
  update(comment: IComment): Promise<IComment>;
  test(blogid: number, reply: boolean): Promise<Array<IComment>>;
}