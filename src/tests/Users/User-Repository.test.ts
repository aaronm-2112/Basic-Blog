//Purpose: Basic tests to look for PGSQL User repository queries for errors.

import UserRepository from '../../User/Repositories/UserPGSQLRepo'
import User from '../../User/User'
import { createDB, resetDB, populateDBWithTestData } from '../../dbinit'
import PGConnection from '../../Common/PGConnection'
import { mocked } from 'ts-jest/utils'

jest.mock('../../Common/PGConnection')
jest.mock('../../User/User')


describe("PGSQL User repository testing suite", () => {

  beforeEach(async () => {
    let mockConnectionObject = new PGConnection()
    mocked(User).mockClear()
    await resetDB(mockConnectionObject)
    await createDB(mockConnectionObject)
    await populateDBWithTestData(mockConnectionObject)
  })

  test("Find returns the user that matches the given username", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    let mockuser = await repo.find("First User")
    expect(mockuser.setUsername).toHaveBeenCalledWith("First User")
    expect(mockuser.setPassword).toHaveBeenCalledWith("1234")
    expect(mockuser.setEmail).toHaveBeenCalledWith("aaron.m@gmail.com")
    expect(mockuser.setFirstname).toHaveBeenCalledWith("aaron")
    expect(mockuser.setLastname).toHaveBeenCalledWith("g")
    expect(mockuser.setBio).toHaveBeenCalledWith("my bio")
    expect(mockuser.setProfilePicPath).toHaveBeenCalledWith("/uploads/1234")
  })

  test("Find throws an error when no user exists", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    await expect(repo.find("No User")).rejects.toThrow("Error: Not found");
  })

  test("Create works", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    let mockuser = new User()
    let userid = await repo.create(mockuser)
    expect(userid).toBeGreaterThan(1)
    expect(mockuser.getUsername()).toHaveBeenCalled
    expect(mockuser.getPassword()).toHaveBeenCalled
    expect(mockuser.getEmail()).toHaveBeenCalled
    expect(mockuser.getFirstname()).toHaveBeenCalled
    expect(mockuser.getLastname()).toHaveBeenCalled
    expect(mockuser.getBio()).toHaveBeenCalled
    expect(mockuser.getSalt()).toHaveBeenCalled
    expect(mockuser.getProfilePicPath()).toHaveBeenCalled
  })

  test("Create throws an error when the username already exists", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    mocked(User).mockImplementation((): User => {
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
        getUsername: jest.fn(() => { return "First User" }),
        setPassword: jest.fn((value: string) => { }),
        getPassword: jest.fn(() => { return "1234" }),
        setEmail: jest.fn((value: string) => { }),
        getEmail: jest.fn(() => { return "air.m@gmail.com" }),
        setFirstname: jest.fn((value: string) => { }),
        getFirstname: jest.fn(() => { return "a" }),
        setLastname: jest.fn((value: string) => { }),
        getLastname: jest.fn(() => { return "m" }),
        setBio: jest.fn((value: string) => { }),
        getBio: jest.fn((): string => { return "b" }),
        setSalt: jest.fn((value: string) => { }),
        getSalt: jest.fn((): string => { return "1223f" }),
        setProfilePicPath: jest.fn((value: string) => { }),
        getProfilePicPath: jest.fn((): string => { return "path/to/pic" }),
        usernameMatches: jest.fn((value: string): boolean => { return false })
      }
    })
    let mockuser = new User()
    await expect(repo.create(mockuser)).rejects.toThrowError()
  })

  test("Create throws an error when the email already exists", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    mocked(User).mockImplementation((): User => {
      return {
        userid: 1,
        username: "None User",
        password: "1234",
        email: "aaron.m@gmail.com",
        firstname: "a",
        lastname: "m",
        bio: "b",
        salt: "1223f",
        profilepic: "path/to/pic",
        setUserid: jest.fn((value: number) => { }),
        getUserid: jest.fn(() => { return 1 }),
        setUsername: jest.fn((value: string) => { }),
        getUsername: jest.fn(() => { return "None User" }),
        setPassword: jest.fn((value: string) => { }),
        getPassword: jest.fn(() => { return "1234" }),
        setEmail: jest.fn((value: string) => { }),
        getEmail: jest.fn(() => { return "aaron.m@gmail.com" }),
        setFirstname: jest.fn((value: string) => { }),
        getFirstname: jest.fn(() => { return "a" }),
        setLastname: jest.fn((value: string) => { }),
        getLastname: jest.fn(() => { return "m" }),
        setBio: jest.fn((value: string) => { }),
        getBio: jest.fn((): string => { return "b" }),
        setSalt: jest.fn((value: string) => { }),
        getSalt: jest.fn((): string => { return "1223f" }),
        setProfilePicPath: jest.fn((value: string) => { }),
        getProfilePicPath: jest.fn((): string => { return "path/to/pic" }),
        usernameMatches: jest.fn((value: string): boolean => { return false })
      }
    })
    let mockuser = new User()
    await expect(repo.create(mockuser)).rejects.toThrowError()
  })

  test("Update works when given an existing user", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    mocked(User).mockImplementation((): User => {
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
        getUsername: jest.fn(() => { return "First User" }),
        setPassword: jest.fn((value: string) => { }),
        getPassword: jest.fn(() => { return "1234" }),
        setEmail: jest.fn((value: string) => { }),
        getEmail: jest.fn(() => { return "air.m@gmail.com" }),
        setFirstname: jest.fn((value: string) => { }),
        getFirstname: jest.fn(() => { return "a" }),
        setLastname: jest.fn((value: string) => { }),
        getLastname: jest.fn(() => { return "m" }),
        setBio: jest.fn((value: string) => { }),
        getBio: jest.fn((): string => { return "b" }),
        setSalt: jest.fn((value: string) => { }),
        getSalt: jest.fn((): string => { return "1223f" }),
        setProfilePicPath: jest.fn((value: string) => { }),
        getProfilePicPath: jest.fn((): string => { return "path/to/pic" }),
        usernameMatches: jest.fn((value: string): boolean => { return false })
      }
    })
    let mockuser = new User()
    let mockupdateduser = await repo.update(mockuser)

    //ensure the updated user has the expected updated property values 
    expect(mockupdateduser.setUserid).toHaveBeenCalledWith(1)
    expect(mockupdateduser.setUsername).toHaveBeenCalledWith("First User")
    expect(mockupdateduser.setPassword).toHaveBeenCalledWith("1234")
    expect(mockupdateduser.setEmail).toHaveBeenCalledWith("aaron.m@gmail.com")
    expect(mockupdateduser.setFirstname).toHaveBeenCalledWith("a")
    expect(mockupdateduser.setLastname).toHaveBeenCalledWith("m")
    expect(mockupdateduser.setBio).toHaveBeenCalledWith("b")
    expect(mockupdateduser.setProfilePicPath).toHaveBeenCalledWith("path/to/pic")
  })

  test("Update throws an error when trying to update a user that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new UserRepository(mockConnectionObject)
    mocked(User).mockImplementation((): User => {
      return {
        userid: 1,
        username: "Not User",
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
        getUsername: jest.fn(() => { return "Not User" }),
        setPassword: jest.fn((value: string) => { }),
        getPassword: jest.fn(() => { return "1234" }),
        setEmail: jest.fn((value: string) => { }),
        getEmail: jest.fn(() => { return "air.m@gmail.com" }),
        setFirstname: jest.fn((value: string) => { }),
        getFirstname: jest.fn(() => { return "a" }),
        setLastname: jest.fn((value: string) => { }),
        getLastname: jest.fn(() => { return "m" }),
        setBio: jest.fn((value: string) => { }),
        getBio: jest.fn((): string => { return "b" }),
        setSalt: jest.fn((value: string) => { }),
        getSalt: jest.fn((): string => { return "1223f" }),
        setProfilePicPath: jest.fn((value: string) => { }),
        getProfilePicPath: jest.fn((): string => { return "path/to/pic" }),
        usernameMatches: jest.fn((value: string): boolean => { return false })
      }
    })
    let mockuser = new User()
    await expect(repo.update(mockuser)).rejects.toThrowError("Error: Not found")
  })
})