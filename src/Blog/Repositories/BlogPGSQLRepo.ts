import IBlogRepository from "./IBlogRepository";
import { searchParameters } from '../BlogSearchCriteria';
import IBlog from '../IBlog';
import Blog from '../Blog';
import { Pool } from 'pg';
import PGConnection from "../../Common/PGConnection";
import { errorMonitor } from "events";

//purpose: perform basic crud ops with the blog table using postgresql.
//         Used in controllers. Decouples database layer from higher level modules.
//How it works: pool of connections is used to perform usercontroller requests on the blog data. Paramaterized queries are used for sql injection protection.
export default class BlogPGSQLRepo implements IBlogRepository {
  //the postgresql connection pool
  private pool: Pool;

  constructor(connectionObj: PGConnection) {
    //create the connection pool
    this.pool = new Pool({
      user: connectionObj.getUser(),
      host: connectionObj.getHost(),
      database: connectionObj.getDatabase(),
      password: connectionObj.getPassword(),
      port: connectionObj.getPort()
    });
  }

  //find all blogs using a certain search criteria 
  //Uses the blogid to perform basic keyset pagination. Returns only 10 results per search.
  async findAll(searchBy: searchParameters, searchByValue: string, key: string, keyCondition: string): Promise<IBlog[]> {
    try {
      let query: string;
      //determine query condition
      if (keyCondition === '>') {
        //analagous to getting the next set of results
        query = `SELECT * FROM blogs WHERE ${searchBy} = $1 AND blogid ${keyCondition} ${key} LIMIT 10`;
      } else if (keyCondition === '<') {
        //analagous to getting the previous results
        //query = `SELECT * FROM blogs WHERE ${searchBy} = $1 AND blogid < ${key} AND blogid >= ${key} - 10 LIMIT 10`;
        query = `SELECT * FROM blogs WHERE ${searchBy} = $1 AND blogid < ${key} ORDER BY blogid DESC LIMIT 10`;
      } else {
        throw new Error("Condition not acceptable");
      }

      //create the collection of query values
      let values: string[] = [];

      //add the search value to the value collection
      values.push(searchByValue);

      //execute the query
      let result = await this.pool.query(query, values);

      //retrieve the result rows
      let rows: any[] = result.rows;

      //create the blog array
      let blogs: IBlog[] = [];
      let blog: IBlog;

      //place results into the blog array 
      rows.forEach(row => {
        blog = new Blog(); //TODO: Find better way to create a deep copy
        blog.setBlogid(row.blogid);
        blog.setTitle(row.title);
        blog.setTitleimagepath(row.titleimagepath);
        blog.setUsername(row.username);
        blog.setContent(row.content);
        //push blog into blog array 
        blogs.push(blog);
      });

      //return the results to the client 
      return blogs;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  //return the resulting row that meets the search criteria
  //if a searchBy value returns more than one row, then only the first row values are returned to the client.
  async find(searchBy: searchParameters, value: string): Promise<IBlog> {
    try {
      //prepare the query to find the blog
      let query: string = `SELECT blogid, username, title, content, titleimagepath FROM blogs WHERE ${searchBy} = $1`;

      //prepare the values for the query
      let values: string[] = [];
      values.push(value);

      //execute the query
      let result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new Error("Not found")
      }

      //get the row from the result
      let row = result.rows[0];

      //place the row data into a blog object and return it
      let blog: IBlog = new Blog();

      blog.setBlogid(row.blogid);
      blog.setTitle(row.title);
      blog.setTitleimagepath(row.titleimagepath);
      blog.setContent(row.content);
      blog.setUsername(row.username);

      return blog;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(blog: IBlog): Promise<number> {
    try {
      //prepare the insert query
      let query: string = `INSERT INTO blogs ( username, title, content) VALUES ($1, $2, $3) RETURNING blogid`;

      //prepare the insert values -- order matters
      let values: string[] = [];
      values.push(blog.getUsername());
      values.push(blog.getTitle());
      values.push(blog.getContent());

      //execute the insertion
      let result = await this.pool.query(query, values);

      //retrieve the last rowID from the result object -- lastID is only populated when we use an insert
      let blogID: number = result.rows[0]["blogid"];

      //return database
      return blogID;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  //upddate any changes that occur to the blog. Do not update BlogID
  //TODO: Refactor the entries method as this will not work when properties are made private
  async update(blog: IBlog): Promise<IBlog> {
    try {
      //check if blogID is filled
      if (blog.blogid < 0) {
        throw new Error("No ID");
      }

      //store blog properties and their respective values that need to be updated
      let queryProperties: string[] = [];
      let queryValues: string[] = [];

      // get the blog object's properties and property values -- each entry is: ['property', 'property value']
      let blogEntries = Object.entries(blog);

      //create parameter position indicator
      let parameterNumber: number = 1;

      //traverse the blog's entries
      for (var entry in blogEntries) {
        //determine which blog properties need to be updated
        if (blogEntries[entry][1] !== undefined && blogEntries[entry][1] !== null && blogEntries[entry][0] !== 'blogid' && blogEntries[entry][0] !== "username" && typeof (blogEntries[entry][1]) !== 'function') { //empty string not acceptable update value nor is a function (for getters and setters)
          //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
          queryProperties.push(blogEntries[entry][0] + ` = $${parameterNumber}`);
          //push the blog property value into the list of query values
          queryValues.push(blogEntries[entry][1]);
          //inc the param number
          parameterNumber += 1;
        }
      }

      //create the update query
      let query: string = `UPDATE blogs SET ` + queryProperties.join(',') + ` WHERE blogid = $${parameterNumber} RETURNING *`;

      //add the blogID to the queryValues list
      queryValues.push(blog.blogid.toString());

      //execute the update query
      let result = await this.pool.query(query, queryValues);

      if (!result.rows.length) {
        throw new Error("Not found");
      }

      //get the updated row
      let row: any = result.rows[0];

      //create an updated blog
      let updatedBlog: IBlog = new Blog();
      updatedBlog.setUsername(row.username);
      updatedBlog.setBlogid(row.blogid);
      updatedBlog.setContent(row.content);
      updatedBlog.setTitle(row.title);
      updatedBlog.setTitleimagepath(row.titleimagepath);

      return updatedBlog;
    } catch (e) {
      throw new Error(e);
    }

  }

  // //TODO: 
  // async delete(blog: IBlog): Promise<Boolean> {
  //   try {

  //     //prepare the blog deletion statement
  //     let query = `DELETE FROM Blog WHERE blogid = $1`;

  //     //collect the query values
  //     let values: string[] = [];
  //     values.push(blog.blogid.toString());

  //     //execute the delete query
  //     await this.pool.query(query, values);

  //     return true;

  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }
}