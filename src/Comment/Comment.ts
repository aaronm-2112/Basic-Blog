export default interface Comment {
  commentid: number; //pk
  username: string; //fk to users
  blogid: number;  //fs to blogs
  content: string;
  reply: boolean; //marks if comment is a reply or not
  replyto: number; //refers to the cid that this comment is a reply to -- empty/0 if not a reply
  likes: number; //amount of likes this comment has received
}