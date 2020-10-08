
/*
Purpose:  A concrete implementation of the blog interface 
Note: kept interfaces but moved properties to base classes due to jest making private properties 
     inaccesible and me not finding a suitable workaround that would be worth it 
     -- not worth it in that i don't need the extra extensibility in this project.
*/
import IBlog from "./IBlog";


//TODO: Add getters and setters
export default class Blog implements IBlog {
  blogid: number;
  username: string;
  title: string;
  content: string;
  titleimagepath: string;

  constructor() {
    this.blogid = -1; //give junk value so it breaks if unset id gets through 
    this.username = "";
    this.title = "";
    this.content = "";
    this.titleimagepath = "";
  }

  //getters
  getBlogid(): number {
    return this.blogid;
  }
  getUsername(): string {
    return this.username;
  }
  getTitle(): string {
    return this.title;
  }
  getContent(): string {
    return this.content;
  }
  getTitleimagepath(): string {
    return this.titleimagepath;
  }

  //setters
  setBlogid(id: number): void {
    this.blogid = id;
  }
  setUsername(username: string): void {
    this.username = username;
  }
  setTitle(title: string): void {
    this.title = title;
  }
  setContent(content: string): void {
    this.content = content;
  }
  setTitleimagepath(titleimagepath: string): void {
    this.titleimagepath = titleimagepath;
  }


  //validate if a user owns this blog resource
  creator(incomingUser: string): boolean {
    if (this.username === incomingUser) {
      return true;
    }
    return false;
  }
}