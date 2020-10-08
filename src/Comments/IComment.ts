export default interface IComment {
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