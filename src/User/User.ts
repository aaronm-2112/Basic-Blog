import IUser from "./IUser";

// Can implement an interface for a User if it will become necessary in the future. 
export default class User implements IUser {
  userid: Number;
  username: String;
  password: string;
  email: String;
  firstname: String;
  lastname: String;
  bio: String;
  salt: string;
  profilepic: string;

  constructor() {
    this.userid = 0;
    this.username = "";
    this.password = "";
    this.email = "";
    this.firstname = "";
    this.lastname = "";
    this.bio = "";
    this.salt = "";
    this.profilepic = "";
  }

  setUserid(id: Number): void {
    this.userid = id;
  }
  getUserid(): Number {
    return this.userid;
  }

  getUsername(): String {
    return this.username;
  }

  setUsername(username: String): void {
    this.username = username;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getEmail(): String {
    return this.email;
  }

  setEmail(email: String): void {
    this.email = email;
  }

  getFirstname(): String {
    return this.firstname;
  }

  setFirstname(firstname: String): void {
    this.firstname = firstname;
  }

  getLastname(): String {
    return this.lastname;
  }

  setLastname(lastname: String): void {
    this.lastname = lastname;
  }

  getBio(): String {
    return this.bio;
  }

  setBio(bio: String): void {
    this.bio = bio;
  }

  getSalt(): string {
    return this.salt;
  }

  setSalt(salt: string): void {
    this.salt = salt;
  }

  getProfilePicPath(): string {
    return this.profilepic;
  }
  setProfilePicPath(path: string): void {
    this.profilepic = path;
  }

  usernameMatches(incomingUsername: string): boolean {
    return this.username === incomingUsername;
  }

} 