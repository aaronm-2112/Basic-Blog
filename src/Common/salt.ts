//Purpose: Use bcrypt to create a salt based off a user's password. Use the salt to generate a hash for the user.
//         Used to store passwords in a more secure manner -- more resistant to brute force attacks and rainbow tables.  
import bcrypt from 'bcrypt';

//uses bcrypts algorithm to create a randomized salt
export async function generateUserSalt(): Promise<string> {
  let saltRounds: number = 10;
  let salt: string;
  salt = await bcrypt.genSalt(saltRounds);
  return salt;
}

//uses bcrypt's algorithm to create a hash based off the salt
export async function generateUserHash(password: string, salt: string): Promise<string> {
  let hash: string = await bcrypt.hash(password, salt);
  return hash;
}

export async function compareUserPassword(incomingPassword: string, userHash: string): Promise<boolean> {
  let samePassword: boolean = await bcrypt.compare(incomingPassword, userHash);
  return samePassword;
}