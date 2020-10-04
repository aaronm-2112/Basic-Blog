//Purpose: Act as a connection settings configuration object for PGSQl repositories. 

export default class PGConnection {
  user: string
  host: string
  database: string
  password: string
  port: number

  constructor() {
    this.user = "";
    this.host = "";
    this.database = "";
    this.password = "";
    this.port = 0;
  }

  //getters
  getUser(): string {
    return this.user;
  }

  getHost(): string {
    return this.host;
  }

  getDatabase(): string {
    return this.database;
  }

  getPassword(): string {
    return this.password;
  }

  getPort(): number {
    return this.port;
  }

  //setters
  setUser(user: string): void {
    this.user = user;
  }

  setHost(host: string): void {
    this.host = host;
  }
  setDatabase(database: string): void {
    this.database = database;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setPort(port: number): void {
    this.port = port;
  }


}
