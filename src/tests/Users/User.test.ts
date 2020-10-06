import User from '../../User/User';

//Setter and getter testing---------------------------------------------------------
test("Setters and getters for userid are correct", () => {
  let user: User = new User()
  user.setUserid(1)
  expect(user.getUserid()).toBe(1)
})

test("Setters and getters for username are correct", () => {
  let user: User = new User()
  user.setUsername("First User")
  expect(user.getUsername()).toBe("First User")
})

test("Setters and getters for password are correct", () => {
  let user: User = new User()
  user.setPassword("1234")
  expect(user.getPassword()).toBe("1234")
})

test("Setters and getters for email are correct", () => {
  let user: User = new User()
  user.setEmail("aaron.marr@gmail.com")
  expect(user.getEmail()).toBe("aaron.marr@gmail.com")
})

test("Setters and getters for firstname are correct", () => {
  let user: User = new User()
  user.setFirstname("aaron")
  expect(user.getFirstname()).toBe("aaron")
})

test("Setters and getters for lastname are correct", () => {
  let user: User = new User()
  user.setLastname("aaron")
  expect(user.getLastname()).toBe("aaron")
})

test("Setters and getters for bio are correct", () => {
  let user: User = new User()
  user.setBio("my bio")
  expect(user.getBio()).toBe("my bio")

})

test("Setters and getters for salt are correct", () => {
  let user: User = new User()
  user.setSalt("123214f")
  expect(user.getSalt()).toBe("123214f")
})

test("Setters and getters for profilepic are correct", () => {
  let user: User = new User()
  user.setProfilePicPath("path/to/file")
  expect(user.getProfilePicPath()).toBe("path/to/file")
})

//testing the usernameMatches method
test("Client username matches with comment's username -- return true", () => {
  let user: User = new User()
  user.setUsername("First User")
  expect(user.usernameMatches("First User")).toBe(true)
})

test("Client username does not match with comment's username -- return false", () => {
  let user: User = new User()
  user.setUsername("First User")
  expect(user.usernameMatches("First Client")).toBe(false)
})



