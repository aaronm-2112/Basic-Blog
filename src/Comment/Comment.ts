import IComment from './IComment';

export default class Comment implements IComment {
  commentid: number; //pk
  username: string; //fk to users
  blogid: number;  //fs to blogs
  content: string;
  reply: boolean; //marks if comment is a reply or not
  replyto: number; //refers to the cid that this comment is a reply to -- empty/0 if not a reply
  likes: number; //amount of likes this comment has received -- non-replies ordered by likes
  likedby: string[];
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
    this.likedby = [];
    this.deleted = false;
    this.created = new Date();
  }

  setCreatedDate(date: Date): void {
    this.created = date;
  }

  getCreatedDate(): Date {
    return this.created;
  }

  //add a like to the comment's like count and the user who liked the comment to the comment's likedby collection
  addLike(username: string): boolean {
    if (!this.alreadyLiked(username)) {
      this.likes += 1;
      this.likedby.push(username);
      return true;
    }

    return false;
  }

  //determine if a user already liked this comment -- if so they cannot like it again
  alreadyLiked(username: string): boolean {
    let liked: boolean = this.likedby.some((user) => {
      return user === username;
    });

    return liked;
  }

  //marks a comment as deleted, setting comment content to [deleted]
  markDeleted(username: string): boolean {
    //ensure incoming user owns the comment
    if (this.username !== username) {
      //comment not marked as deleted b/c user does not own the comment
      return false;
    }

    //set deleted to true 
    this.deleted = true;

    //set content to [deleted]
    this.content = "[deleted]";

    //return true to indicate comment is marked as deleted
    return true;
  }

  //edit the comment's content
  editContent(username: string, content: string): boolean {
    //ensure incoming user owns the comment
    if (this.username !== username) {
      //comment not marked as deleted b/c user does not own the comment
      return false;
    }

    //check if the comment is marked as deleted
    if (this.deleted) {
      //cannot edit content when comment is marked as deleted
      return false;
    }

    //edit the comment content
    this.content = content;

    //return true
    return true;
  }


  // //check comment properties against incoming values and update if any changes
  // updateComment(content: string = "", username: string = "", deleted: boolean = false, like: boolean = false): void {
  //   if (this.content !== content) this.content = content;
  //   if (this.username !== username) this.username = username;
  //   if (this.deleted !== deleted) this.deleted = deleted;
  //   if (like) this.likes += 1;
  // }



}