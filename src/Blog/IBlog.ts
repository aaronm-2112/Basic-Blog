//Purpose: Model for blog domain entity. If domain logic is required beyond getters and setters -- like verification -- it will be added here. 

//TODO: Add getters and setters, make abstract class too, make properties private
export default interface IBlog {
  blogid: number;
  username: string;
  title: string;
  content: string;
  titleimagepath: string;

  //getters
  getBlogid(): number;
  getUsername(): string;
  getTitle(): string;
  getContent(): string;
  getTitleimagepath(): string;

  //setters
  setBlogid(id: number): void;
  setUsername(username: string): void;
  setTitle(title: string): void;
  setContent(content: string): void;
  setTitleimagepath(titleimagepath: string): void;


  //determine if the user created the blog -- implies ownership
  creator(incomingUser: string): boolean;
}