import Auth from "../Auth/Auth";
import User from "../User/User";




export async function createJWTCookie(user: User) {
  let jwtBearerToken: string = await new Auth().createJWT(user)

  //let sessionJSON = JSON.stringify(jwtBearerToken)

  //const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`jwt=${jwtBearerToken}`]

} 