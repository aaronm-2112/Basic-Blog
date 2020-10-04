// blogid: number;
// username: string;
// title: string;
// content: string;
// titleimagepath: string;
import Blog from '../../Blog/Blog'

//Getters and setter tests------------------------------------
test("Setters and getters for blogid are correct", () => {
  let blog: Blog = new Blog()
  blog.setBlogid(1)
  expect(blog.getBlogid()).toBe(1)
})

test("Setters and getters for username are correct", () => {
  let blog: Blog = new Blog()
  blog.setUsername("Aa")
  expect(blog.getUsername()).toBe("Aa")
})

test("Setters and getters for title are correct", () => {
  let blog: Blog = new Blog()
  blog.setTitle("Title 1")
  expect(blog.getTitle()).toBe("Title 1")
})

test("Setters and getters for content are correct", () => {
  let blog: Blog = new Blog()
  blog.setContent("Newest content")
  expect(blog.getContent()).toBe("Newest content")
})

test("Setters and getters for titleimagepath are correct", () => {
  let blog: Blog = new Blog()
  blog.setTitleimagepath("/path/file")
  expect(blog.getTitleimagepath()).toBe("/path/file")
})

//Creator method testing-----------------------------------------
test("Should return true that the client that created a blog is the owner of the blog", () => {
  let blog: Blog = new Blog()
  blog.setUsername("First User")
  expect(blog.creator("First User")).toBe(true)
})

test("Should return false that a client is the creator of the blog when they are not the creator", () => {
  let blog: Blog = new Blog()
  blog.setUsername("First User")
  expect(blog.creator("First Client")).toBe(false)
})