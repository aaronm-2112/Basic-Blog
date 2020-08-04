//Purpose: Something to create the database I want.
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import IUser from './User/IUser';

const dbPath = path.resolve(__dirname, 'blog.db');

export async function createDB() {
  try {
    //C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db
    const db: Database = await open({
      filename: "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db",
      driver: sqlite3.Database
    })

    await db.exec('DROP TABLE User');
    await db.exec('DROP TABLE Blog');

    //Create User table
    let res = await db.exec('CREATE TABLE User (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, firstname TEXT, lastname TEXT, bio TEXT, salt TEXT, profilePic TEXT)');

    //Create blog table
    let blogRes = await db.exec('CREATE TABLE Blog (blogID INTEGER PRIMARY KEY AUTOINCREMENT, username INTEGER, title TEXT NOT NULL, content TEXT, titleImagePath TEXT, FOREIGN KEY(username) REFERENCES User(username))');



    await db.close();


  } catch (e) {
    console.error(e);
  }
}