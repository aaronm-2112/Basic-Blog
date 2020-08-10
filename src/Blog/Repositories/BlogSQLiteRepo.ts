import IBlogRepository from "./IBlogRepository";
import { searchParameters } from '../BlogSearchCriteria';
//import { buildBlogUpdateQuery } from '../Common/queryBuilder';
import IBlog from '../IBlog';
import Blog from '../Blog';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

//purpose: perform basic crud ops with the blog table using sqlite.Used in controllers. Decouples database layer from higher level modules.
export default class BlogSQLiteRepo implements IBlogRepository {

  private dbPath: string = "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db";

  //find all blogs using a certain search criteria 
  async findAll(searchBy: searchParameters, value: string): Promise<IBlog[]> {
    try {
      //connect to the database 
      let db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //prepare the blog search query as a prepared statement
      let statement = await db.prepare(`SELECT blogID, username, title, content, titleImagePath FROM Blog WHERE ${searchBy} = ? `);

      //execute the query 
      let rows: any[] = await statement.all(value);

      //create the blog array
      let blogs: IBlog[] = [];
      let blog: IBlog;

      //place results into the blog array 
      rows.forEach(row => {
        blog = new Blog(); //TODO: Find better way to create a deep copy
        blog.blogID = row.blogID;
        blog.title = row.title;
        blog.titleImagePath = row.titleImagePath;
        blog.username = row.username;
        blog.content = row.content;

        //push blog into blog array 
        blogs.push(blog);
      });

      //finalize statement -- can skip this
      statement.finalize();

      //close db
      await db.close();

      //return the results to the client 
      return blogs;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async find(searchBy: searchParameters, value: string): Promise<IBlog> {
    try {
      console.log("In find");

      //connect to the database 
      let db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      });

      //prepare the query to find the blog
      let statement = await db.prepare(`SELECT blogID, username, title, content, titleImagePath FROM Blog WHERE ${searchBy} = ?`);
      //db.prepare(`SELECT blogID, username, title, content, titleImagePath FROM Blog WHERE ${searchBy} = ? `);

      //execute the query 
      let row: any = await statement.get(value);

      //place the row data into a blog object and return it
      let blog: IBlog = new Blog();

      blog.blogID = row.blogID;
      blog.title = row.title;
      blog.titleImagePath = row.titleImagePath;
      blog.content = row.content;
      blog.username = row.username;

      //finalize the statement
      statement.finalize();

      //close the database connection
      await db.close();

      return blog;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(blog: IBlog): Promise<number> {
    try {
      //connect to the database
      let db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //prepare the insert statement 
      let statement = await db.prepare(`INSERT INTO Blog ( username, title, content, titleImagePath) VALUES (?, ?, ?, ?)`);

      //execute the insertion
      let result = await statement.run(blog.username, blog.title, blog.content, blog.titleImagePath);

      console.log(result);

      //retrieve the last rowID from the result object -- lastID is only populated when we use an insert
      let rowID: number = (result.lastID as number);

      //finalize statmenet
      await statement.finalize();

      //close db
      await db.close();

      //return database
      return rowID;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  //upddate any changes that occur to the blog. Do not update BlogID
  async update(blog: IBlog): Promise<void> {
    try {
      console.log("In update");

      //check if blogID is filled
      if (blog.blogID < 0) {
        throw new Error("No ID");
      }

      //open the database
      let db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      });

      //store blog properties and their respective values that need to be updated
      let queryProperties: string[] = [];
      let queryValues: string[] = [];

      // get the blog object's properties and property values -- each entry is: ['property', 'property value']
      let blogEntries = Object.entries(blog);

      //traverse the blog's entries
      for (var entry in blogEntries) {
        //determine which blog properties need to be updated
        if (blogEntries[entry][1] !== undefined && blogEntries[entry][1] !== null && blogEntries[entry][0] !== 'blogID' && blogEntries[entry][1] !== "") { //empty string not acceptable update value
          //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
          queryProperties.push(blogEntries[entry][0] + ' = ?');
          //push the blog property value into the list of query values
          queryValues.push(blogEntries[entry][1]);
        }
      }

      //create the update query
      let query: string = `UPDATE BLOG SET ` + queryProperties.join(',') + ` WHERE blogID = ?`;

      console.log(query);

      //create the prepared statement to update the blog
      let statement = await db.prepare(query);

      //get the blog ID from the blog object
      let blogID: string = blog.blogID.toString();

      //execute the statement 
      let result = await statement.run(...queryValues, blogID);

      console.log(result);

      //finalize statmenet
      await statement.finalize();

      //close db
      await db.close();

      return;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }

  }

  async delete(blog: IBlog): Promise<Boolean> {
    try {
      //open the database
      let db: Database = await open({
        filename: `${this.dbPath}`,
        driver: sqlite3.Database
      })

      //prepare the blog deletion statement
      let statement = await db.prepare(`DELETE FROM Blog WHERE blogID = ?`);

      //delete the blog 
      await statement.run(blog.blogID);

      //finalize statement
      statement.finalize();

      //close database connection
      await db.close();

      return true;

    } catch (e) {
      console.log(e);
      return false;
    }
  }
}