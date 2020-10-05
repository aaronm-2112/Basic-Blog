import UserRepository from '../../User/Repositories/PGSQLRepo'
import User from '../../User/User'
import { createDB, resetDB, populateDBWithTestData } from '../../dbinit'
import PGConnection from '../../Common/PGConnection'
import { UserQueryParameters } from '../../User/UserQueryParameters'

jest.mock('../../User/User')
jest.mock('../../Common/PGConnection')

describe("Blog repository testing suite", () => {
  beforeEach(async () => {
    let mockConnectionObject = new PGConnection()
    await resetDB(mockConnectionObject)
    await createDB(mockConnectionObject)
    await populateDBWithTestData(mockConnectionObject)
  })

  test("Find returns the user that match the criteria", async () => {
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




})