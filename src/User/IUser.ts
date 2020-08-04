//Purpose: Provide an interface for User entities. 

export default interface IUser {
  userID: Number;
  username: String;
  password: String;
  email: String;
  firstname: String;
  lastname: String;
  bio: String;
  salt: string;
  profilePic: string;

  getUsername(): String;
  setUsername(username: String): void;
  getPassword(): string;
  setPassword(password: string): void;
  getEmail(): String;
  setEmail(email: String): void;
  getUserID(): Number;
  //setUserID(id: Number): void;
  getFirstname(): String;
  setFirstname(firstname: String): void;
  getLastname(): String;
  setLastname(lastname: String): void;
  getBio(): String;
  setBio(bio: String): void;
  getSalt(): string;
  setSalt(salt: string): void;
  getProfilePicPath(): string;
  setProfilePicPath(path: string): void;

} 