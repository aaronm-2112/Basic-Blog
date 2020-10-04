// Import this named export into your test file:
const mock = jest.fn().mockImplementation(() => {
  const mockGetUser = jest.fn(() => { return process.env.DB_USER })
  const mockGetHost = jest.fn(() => { return process.env.DB_HOST })
  const mockGetDatabase = jest.fn(() => { return process.env.DB_DATABASE_TEST })
  const mockGetPassword = jest.fn(() => { return process.env.DB_PASS })
  const mockGetPort = jest.fn(() => { process.env.DB_PORT })
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.BD_PASSWORD,
    port: process.env.DB_PORT,
    getUser: mockGetUser,
    getHost: mockGetHost,
    getDatabase: mockGetDatabase,
    getPassword: mockGetPassword,
    getPort: mockGetPort
  };
});

export default mock