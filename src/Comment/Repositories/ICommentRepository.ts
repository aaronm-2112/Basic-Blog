//Purpose: Access the comment objects stored in the data layer. 

import IComment from '../IComment';

export default interface ICommentRepository {
  findAll(blogid: number, reply: boolean, replyTo: number, orderBy: string, likes: number, cid: number): Promise<Array<IComment>>; //returns top level comments ordered by likes, or date
  //findAllByDate(): Array<IComment>; //returns comments(top level or replies) ordered by date
  create(comment: IComment): Promise<number>; //create comment return the cid
}