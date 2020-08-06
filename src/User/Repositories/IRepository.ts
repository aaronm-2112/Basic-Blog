//Purpose: To provide an interface for data access usable by the application controllers.
//Rationale: Encapsulates data access layer and provide a common interface for it so that data access logic can be changed at run time. 
import IUser from '../IUser';
import { UserQueryParameters } from '../UserQueryParameters';

// Interface of basic C.R.U.D operations for the User database entity
export default interface IUserRepository {
  findAll(searchBy: UserQueryParameters, searchValue: string): Promise<IUser[]>;
  find(username: string): Promise<IUser>;
  create(user: IUser): Promise<Boolean>;
  update(user: IUser): Promise<void>;
  delete(email: string): Promise<Boolean>;
}
