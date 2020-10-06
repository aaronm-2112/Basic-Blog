// Import this named export into your test file:
const mock = jest.fn().mockImplementation(() => {
  return {
    userid: 1,
    username: "First User",
    password: "1234",
    email: "air.m@gmail.com",
    firstname: "a",
    lastname: "m",
    bio: "b",
    salt: "1223f",
    profilepic: "path/to/pic",
    setUserid: jest.fn((value: number) => { }),
    getUserid: jest.fn(() => { return 1 }),
    setUsername: jest.fn((value: string) => { }),
    getUsername: jest.fn(() => { return "Other User" }),
    setPassword: jest.fn((value: number) => { }),
    getPassword: jest.fn(() => { return "1234" }),
    setEmail: jest.fn((value: number) => { }),
    getEmail: jest.fn(() => { return "air.m@gmail.com" }),
    setFirstname: jest.fn((value: number) => { }),
    getFirstname: jest.fn(() => { return "a" }),
    setLastname: jest.fn((value: number) => { }),
    getLastname: jest.fn(() => { return "m" }),
    setBio: jest.fn((value: number) => { }),
    getBio: jest.fn(() => { return "b" }),
    setSalt: jest.fn((value: number) => { }),
    getSalt: jest.fn(() => { return "1223f" }),
    setProfilePicPath: jest.fn((value: number) => { }),
    getProfilePicPath: jest.fn(() => { return "path/to/pic" })
  };

});

export default mock