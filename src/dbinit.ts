//Purpose: Something to create the database I want.
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import IUser from './User/IUser';

const dbPath = path.resolve(__dirname, 'blog.db');

export async function createDB() {
  try {
    const db: Database = await open({
      filename: "C:\\Users\\Aaron\\Desktop\\Typescript-Starter\\dist\\blog.db",
      driver: sqlite3.Database
    })

    await db.exec('DROP TABLE User');

    //Create User table
    let res = await db.exec('CREATE TABLE User (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, firstname TEXT, lastname TEXT, bio TEXT, salt TEXT)');

    //Create blog table 
    let blogRes = await db.exec('CREATE TABLE Blog (blogID INTEGER PRIMARY KEY AUTOINCREMENT, username INTEGER FOREIGN KEY, title TEXT NOT NULL, text TEXT, images TEXT)')

    await db.close();


  } catch (e) {
    console.error(e);
  }
}