//Purpose: Interface for the blog repository

import IBlog from "./IBlog";
import { searchParameters } from './BlogSearchCriteria';

export default interface IBlogRepository {
  findAll(searchBy: searchParameters, searchParam: string): Promise<IBlog[]>;
  find(searchBy: searchParameters, searchParam: string): Promise<IBlog>;
  create(blog: IBlog): Promise<Boolean>;
  update(blog: IBlog): Promise<void>;
  delete(blog: string): Promise<Boolean>;
}