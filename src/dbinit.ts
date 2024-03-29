//Purpose: Initialize the database (whether the Database be PGSQL or other)
//How: Each differing database will have its own createDB function. As of now the naming does not reflect this.
import path from 'path';
import { Client } from 'pg';
import PGConnection from './Common/PGConnection';

const dbPath = path.resolve(__dirname, 'blog.db');

export async function createDB(connectionObj: PGConnection) {
  try {
    //Postgress db initilization
    const client = new Client({
      user: connectionObj.getUser(),
      host: connectionObj.getHost(),
      database: connectionObj.getDatabase(),
      password: connectionObj.getPassword(),
      port: connectionObj.getPort()
    });

    await client.connect();

    let pgRes;

    //create the tables----------------------------------

    //TABLE users
    pgRes = await client.query(`CREATE TABLE users (
        userid serial primary key,
        username text not null unique,
        password text not null,
        email text not null unique,
        firstname text,
        lastname text,
        bio text,
        salt text, 
        profilepic text
    );`);

    //create user index
    pgRes = await client.query(`CREATE UNIQUE INDEX usrs_username_idx ON users(username)`)

    //TABLE blogs
    pgRes = await client.query(`CREATE TABLE blogs ( 
        blogid serial primary key, 
        username text not null, 
        title text not null, 
        content text, 
        titleimagepath text, 
        foreign key(username) references users(username));`);

    //create blog indices to speed pagination
    pgRes = await client.query(`CREATE INDEX blogs_username_idx ON blogs(username)`);

    pgRes = await client.query(`CREATE INDEX blogs_title_idx ON blogs(title)`);

    //TABLE comments
    pgRes = await client.query(`CREATE TABLE comments ( 
        commentid serial primary key, 
        username text not null, 
        blogid integer not null, 
        content text not null, 
        reply boolean not null, 
        replyto integer not null, 
        likes integer not null, 
        likedby text[] default array[]::text[], 
        deleted boolean not null, 
        created timestamp default current_timestamp, 
        foreign key(username) references users(username), 
        foreign key(blogid) references blogs(blogid));`)

    //create comments indices
    pgRes = await client.query(`CREATE INDEX created_idx ON comments(created)`)
    pgRes = await client.query(`CREATE INDEX likes_idx ON comments(likes)`);


    //end the client's connection
    await client.end()

  } catch (e) {
    console.error(e);
  }
}

export async function resetDB(connectionObj: PGConnection) {
  try {
    //Postgress db initilization
    const client = new Client({
      user: connectionObj.getUser(),
      host: connectionObj.getHost(),
      database: connectionObj.getDatabase(),
      password: connectionObj.getPassword(),
      port: connectionObj.getPort()
    });

    await client.connect();

    let pgRes;

    //drop the tables if they exist
    pgRes = await client.query(`DROP TABLE users CASCADE`).catch((e) => console.log("Error dropping users: " + e));
    pgRes = await client.query('DROP TABLE blogs CASCADE').catch((e) => console.log("Error dropping blogs: " + e));
    pgRes = await client.query(`DROP TABLE comments CASCADE`).catch((e) => console.log("Error dropping comments: " + e));

    await client.end()
  } catch (e) {
    console.log(e)
  }
}

//Test data that is used for database testing
export async function populateDBWithTestData(connectionObj: PGConnection) {
  try {
    //Postgress db connection config
    const client = new Client({
      user: connectionObj.getUser(),
      host: connectionObj.getHost(),
      database: connectionObj.getDatabase(),
      password: connectionObj.getPassword(),
      port: connectionObj.getPort()
    });

    await client.connect();

    //insert test users-------------------------

    //user 1 - First User
    let pgRes = await client.query(`INSERT INTO users (username, password, email, firstname, lastname, bio, salt, profilepic) 
                                    VALUES            ('First User', '1234', 'aaron.m@gmail.com', 'aaron', 'g', 'my bio', '#r4', '/uploads/1234' )`);

    //user 2 - Second User
    pgRes = await client.query(`INSERT INTO users (username, password, email, firstname, lastname, bio, salt, profilepic) 
                                VALUES            ('Second User', '1234', 'jerry.m@gmail.com', 'aaron', 'g', 'my bio', '#r4', '/uploads/1234' )`);

    //insert test blogs-------------------------

    //blog 1 created by First User
    pgRes = await client.query(`INSERT INTO blogs (username, title, content, titleimagepath) 
                                VALUES            ('First User', 'Blog One', 'First blog', '/uploads/1233')`);

    //blog 2 created by First User
    pgRes = await client.query(`INSERT INTO blogs (username, title, content, titleimagepath) 
                                VALUES            ('First User', 'Blog Two', 'Second blog', '/uploads/1233')`);

    // //blog 3 created by Second User
    pgRes = await client.query(`INSERT INTO blogs (username, title, content, titleimagepath) 
                                VALUES            ('Second User', 'Blog One', 'First blog', '/uploads/1233')`);

    //insert test comments----------------------

    //a top level comment in blog 1 
    pgRes = await client.query(`INSERT INTO comments ( username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Good blog!', 'false', '0', '0', '2000-12-31','false')`);

    //The 2nd top level comment in blog 1
    pgRes = await client.query(`INSERT INTO comments (username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Okay blog!', 'false', '0', '0', '2000-12-31','false')`);

    // //A reply to the second top level comment in blog 1
    pgRes = await client.query(`INSERT INTO comments ( username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Not okay blog!', 'true', '2', '0', '2000-12-31','false')`);

    //end the client's connection
    await client.end()
  } catch (e) {
    console.log(e)
  }
}