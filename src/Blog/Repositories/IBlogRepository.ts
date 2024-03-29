//Purpose: Interface for the blog repository

import IBlog from "../IBlog";
import { searchParameters } from '../BlogSearchCriteria';

export default interface IBlogRepository {
  findAll(searchBy: searchParameters, searchParam: string, key: string, keyCondition: string): Promise<IBlog[]>;
  find(searchBy: searchParameters, searchParam: string): Promise<IBlog | null>;
  create(blog: IBlog): Promise<number>;
  update(blog: IBlog): Promise<IBlog>;
  //update(title: string, content: string, username: string, titleImagePath: string, blogID: string): Promise<void>;
  // delete(blog: IBlog): Promise<Boolean>;
}