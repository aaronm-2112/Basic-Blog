//Purpose: Takes the current NODE_ENV as a control and creates the database connections
import PGConnection from './PGConnection';

export default function config(node_env: string): PGConnection {
  try {
    let connectionObject = new PGConnection();

    switch (node_env) {
      case process.env.NODE_ENV_DEV:
        connectionObject.setUser(process.env.DB_USER as string);
        connectionObject.setHost(process.env.DB_HOST as string);
        connectionObject.setDatabase(process.env.DB_DATABASE as string);
        connectionObject.setPassword(process.env.DB_PASS as string);
        connectionObject.setPort(parseInt(process.env.DB_PORT as string));
        break;

      case process.env.NODE_ENV_TEST:
        connectionObject.setUser(process.env.DB_USER as string);
        connectionObject.setHost(process.env.DB_HOST as string);
        connectionObject.setDatabase(process.env.DB_DATABASE_TEST as string);
        connectionObject.setPassword(process.env.DB_PASS as string);
        connectionObject.setPort(parseInt(process.env.DB_PORT as string));
        break;

      case process.env.NODE_ENV_PROD:
        throw new Error("No production setup yet")
      default:
        throw new Error("No environment selected")
    }

    return connectionObject;
  } catch (e) {
    throw new Error(e);
  }
}