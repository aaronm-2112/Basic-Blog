export default interface IComment {
  commentid: number; //pk
  username: string; //fk to users
  blogid: number;  //fs to blogs
  content: string;
  reply: boolean; //marks if comment is a reply or not
  replyto: number; //refers to the cid that this comment is a reply to -- empty/0 if not a reply
  likes: number; //amount of likes this comment has received -- non-replies ordered by likes
  likedby: string[];  //a list of who has liked the current comment
  deleted: boolean; //tells us if the comment is deleted or not
  created: Date;   //tells us when the comment was created -- replies to comments will be ordered by time created. 
  //TODO(but likely won't): Query a time server for a consistent creation date across all user systems.  


  //getters
  getCommentid(): number;
  getUsername(): string;
  getBlogid(): number;
  getContent(): string;
  getReply(): boolean;
  getReplyto(): number;
  getLikes(): number;
  getLikedby(): string[];
  getDeleted(): boolean;
  getCreated(): Date;


  //setters
  setCommentid(commentid: number): void;
  setUsername(username: string): void;
  setBlogid(blogid: number): void;
  setContent(content: string): void;
  setReply(reply: boolean): void;
  setReplyto(replyto: number): void;
  setLikes(likes: number): void;
  setLikedby(likedby: string[]): void;
  setDeleted(deleted: boolean): void;
  setCreated(created: Date): void;


  //validation methods-------------------------------------

  //add a like to a particular comment
  addLike(username: string): void;
  //determine if a user already liked this comment
  alreadyLiked(username: string): boolean;

  //marks a comment as deleted and overwrites the comment's content with "[deleted]"
  markDeleted(username: string): void;
  isOwner(username: string): boolean;
  editContent(username: string, content: string): void




}