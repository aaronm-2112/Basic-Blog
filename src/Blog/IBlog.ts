//Purpose: Model for blog domain entity. If domain logic is required beyond getters and setters -- like verification -- it will be added here. 

//TODO: Add getters and setters, make abstract class too, make properties private
export default interface IBlog {
  blogid: number;
  username: string;
  title: string;
  content: string;
  titleimagepath: string;


  creator(incomingUser: string): boolean;
}