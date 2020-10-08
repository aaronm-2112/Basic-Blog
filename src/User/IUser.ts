//Purpose: Provide an interface for User entities. 

export default interface IUser {
  //getters and setters
  setUserid(id: Number): void;
  getUserid(): Number;
  getUsername(): String;
  setUsername(username: String): void;
  getPassword(): string;
  setPassword(password: string): void;
  getEmail(): String;
  setEmail(email: String): void;
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
  //check if the incoming username matches the current user's username
  usernameMatches(incomingUsername: string): boolean;

} 