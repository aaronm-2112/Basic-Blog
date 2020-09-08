import IComment from './IComment';

export default class Comment implements IComment {
  commentid: number; //pk
  username: string; //fk to users
  blogid: number;  //fs to blogs
  content: string;
  reply: boolean; //marks if comment is a reply or not
  replyto: number; //refers to the cid that this comment is a reply to -- empty/0 if not a reply
  likes: number; //amount of likes this comment has received -- non-replies ordered by likes
  deleted: boolean; //tells us if the comment is deleted or not
  created: Date;   //tells us when the comment was created -- replies to comments will be ordered by time created. 
  //TODO(but likely won't): Query a time server for a consistent creation date across all user systems.  

  constructor() {
    this.commentid = 0; //gets set by database values
    this.username = "";
    this.blogid = 0;
    this.content = "";
    this.reply = false;
    this.replyto = 0;
    this.likes = 0;
    this.deleted = false;
    this.created = new Date();
  }

  setCreatedDate(date: Date): void {
    this.created = date;
  }

  getCreatedDate(): Date {
    return this.created;
  }

  //check comment properties against incoming values and update if any changes
  updateComment(content: string, username: string, deleted: boolean, like: boolean): void {

  }


}