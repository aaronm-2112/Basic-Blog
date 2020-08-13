//Purpose:  A concrete implementation of the blog interface 

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

  //validate if a user owns this blog resource
  creator(incomingUser: string): boolean {
    if (this.username === incomingUser) {
      return true;
    }

    return false;
  }
}