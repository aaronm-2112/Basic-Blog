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

    //TABLE blogs
    pgRes = await client.query(`CREATE TABLE blogs ( 
        blogid serial primary key, 
        username text not null, 
        title text not null, 
        content text, 
        titleimagepath text, 
        foreign key(username) references users(username));`);


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
    pgRes = await client.query(`DROP TABLE users CASCADE`).catch((e) => console.log("OOps"));
    pgRes = await client.query('DROP TABLE blogs CASCADE').catch((e) => console.log("OOps"));
    pgRes = await client.query(`DROP TABLE comments CASCADE`).catch((e) => console.log("OOps"));
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

    //insert a test user
    let pgRes = await client.query(`INSERT INTO users (userid, username, password, email, firstname, lastname, bio, salt, profilepic) 
                                VALUES ('2', 'First User', '1234', 'aaron.m@gmail.com', 'aaron', 'g', 'my bio', '#r4', '/uploads/1234' )`);

    //insert a test blog
    pgRes = await client.query(`INSERT INTO blogs (blogid, username, title, content, titleimagepath) 
                                VALUES ('1', 'First User', 'Blog One', 'First blog', '/uploads/1233')`);

    //insert test comments----------------------

    //a top level comment in blog 1 
    pgRes = await client.query(`INSERT INTO comments ( username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Good blog!', 'false', '0', '0', '2000-12-31','false')`);

    //The 2nd top level comment in blog 1
    pgRes = await client.query(`INSERT INTO comments (username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Okay blog!', 'false', '0', '0', '2000-12-31','false')`);

    //A reply to the second top level comment in blog 1
    pgRes = await client.query(`INSERT INTO comments ( username, blogid, content, reply, replyto, likes, created, deleted)
                                VALUES               ('First User', '1', 'Not okay blog!', 'true', '2', '0', '2000-12-31','false')`);

    //end the client's connection
    await client.end()
  } catch (e) {
    console.log(e)
  }
}