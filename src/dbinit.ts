//Purpose: Something to create the database I want.
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import IUser from './User/IUser';
import pg from 'pg';
import { Pool, Client } from 'pg';

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

    //Postgress db initilization

    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'blog',
      password: 'cBKq#F!23JZQ9*:A',
      port: 5432
    });

    await client.connect();

    let pgRes;

    //drop the tables if they exist
    //pgRes = await client.query(`DROP TABLE users CASCADE`);
    // console.log(pgRes);

    //gRes = await client.query('DROP TABLE blogs');
    // console.log(pgRes);

    //create the tables

    //TABLE users
    // pgRes = await client.query(`CREATE TABLE users (
    //     userid serial primary key,
    //     username text not null unique,
    //     password text not null,
    //     email text not null unique,
    //     firstname text,
    //     lastname text,
    //     bio text,
    //     salt text, 
    //     profilepic text
    // );`);

    //console.log(pgRes);

    //TABLE blogs
    // pgRes = await client.query(`CREATE TABLE blogs (blogid serial primary key, username text not null, title text not null, content text, titleimagepath text, foreign key(username) references users(username));`);

    // console.log(pgRes);


    //DROP TABLE comments
    pgRes = await client.query(`DROP TABLE comments`);

    //TABLE comments --TODO: No reply instead only use replyto?
    pgRes = await client.query(`CREATE TABLE comments (commentid serial primary key, username text not null, blogid integer not null, content text not null, reply boolean not null, replyto integer not null, likes integer not null, likedby text[], deleted boolean not null, created timestamp default current_timestamp, foreign key(username) references users(username), foreign key(blogid) references blogs(blogid));`)

    console.log(pgRes);

    //end the client's connection
    await client.end()



  } catch (e) {
    console.error(e);
  }
}