//Purpose: To provide an interface for data access usable by the application controllers.
//Rationale: Encapsulates data access layer and provide a common interface for it so that data access logic can be changed at run time. 
import IUser from './IUser';

// Interface of basic C.R.U.D operations for the User database entity
export default interface IUserRepository {
  findAll(): Promise<IUser[]>;
  find(email: string): Promise<IUser>;
  create(user: IUser): Promise<Boolean>;
  delete(email: string): Promise<Boolean>;
}
