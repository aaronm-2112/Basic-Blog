import BlogRepository from '../../Blog/Repositories/BlogPGSQLRepo'
import Blog from '../../Blog/Blog'
import { createDB, resetDB, populateDBWithTestData } from '../../dbinit'
import PGConnection from '../../Common/PGConnection'
import { searchParameters } from '../../Blog/BlogSearchCriteria'
import { mocked } from 'ts-jest/utils'


jest.mock('../../Blog/Blog')
jest.mock('../../Common/PGConnection')

describe("PGSQL Blog repository testing suite", () => {
  beforeEach(async () => {
    let mockConnectionObject = new PGConnection()
    await resetDB(mockConnectionObject)
    await createDB(mockConnectionObject)
    await populateDBWithTestData(mockConnectionObject)
  })

  afterEach(async () => {
    let mockConnectionObject = new PGConnection()
    await resetDB(mockConnectionObject)
  })

  test("Findall returns all of the expected blogs with expected property values when searching by username", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let blogs = await repo.findAll(searchParameters.Username, "First User", "1000", "<")
    expect(blogs[0].setBlogid).toHaveBeenCalledWith(2)
    expect(blogs[0].setUsername).toHaveBeenCalledWith("First User")
    expect(blogs[0].setTitle).toHaveBeenCalledWith("Blog Two")
    expect(blogs[0].setContent).toHaveBeenCalledWith("Second blog")
    expect(blogs[0].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233")
  })

  test("Findall returns no items when searching for blogs with a username that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let blogs = await repo.findAll(searchParameters.Username, "Not User", "1000", "<")
    expect(blogs.length).toBe(0)
  })

  test("Findall returns all expected blogs with expected property values when searching by title", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let blogs = await repo.findAll(searchParameters.Title, "Blog One", "1000", "<")

    //first blog result
    expect(blogs[0].setBlogid).toHaveBeenCalledWith(3)
    expect(blogs[0].setUsername).toHaveBeenCalledWith("Second User")
    expect(blogs[0].setTitle).toHaveBeenCalledWith("Blog One")
    expect(blogs[0].setContent).toHaveBeenCalledWith("First blog")
    expect(blogs[0].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233")

    //second blog result
    expect(blogs[1].setBlogid).toHaveBeenCalledWith(1)
    expect(blogs[1].setUsername).toHaveBeenCalledWith("First User")
    expect(blogs[1].setTitle).toHaveBeenCalledWith("Blog One")
    expect(blogs[1].setContent).toHaveBeenCalledWith("First blog")
    expect(blogs[1].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233")
  })

  test("Findall returns no blogs when searching by title for a title that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let blogs = await repo.findAll(searchParameters.Title, "Not Title", "1000", "<")
    expect(blogs.length).toBe(0)
  })

  test("Find returns Second User's blog from the database with the expected property values", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let mockBlog = await repo.find(searchParameters.Username, "Second User")
    expect(mockBlog).not.toBe(null)
    expect(mockBlog!.setBlogid(3))
    expect(mockBlog!.setUsername("Second User"))
    expect(mockBlog!.setContent("First blog"))
    expect(mockBlog!.setTitle("Blog One"))
    expect(mockBlog!.setTitleimagepath("/uploads/1233"))
  })

  test("Find returns null when searching for a blog that does not exist(searching by username)", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    const nullResponse = await repo.find(searchParameters.Username, "Not User")
    expect(nullResponse).toBe(null)
  })

  test("Find returns the expected blog when searching by title", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let mockBlog = await repo.find(searchParameters.Title, "Blog Two")
    expect(mockBlog).not.toBe(null)
    expect(mockBlog!.setBlogid(2))
    expect(mockBlog!.setUsername("First User"))
    expect(mockBlog!.setContent("Blog Two"))
    expect(mockBlog!.setTitle("Second blog"))
    expect(mockBlog!.setTitleimagepath("/uploads/1233"))
  })

  test("Find returns null when searching for a blog that doesn't exist(searching by title)", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    const nullResponse = await repo.find(searchParameters.Title, "Not User")
    expect(nullResponse).toBe(null)
  })

  //I'm less happy with this test b/c the repo may not place one of the getProperty method values into the paramaterized statement, but,
  //call all 3 of them just the same. A fix would be if the create method itself returned the resulting comment to back to the client. 
  test("Create inserts a blog in the database and returns its blogid", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let mockBlog = new Blog()
    let blogid = await repo.create(mockBlog)
    expect(blogid).toBeGreaterThan(1)
    expect(mockBlog.getUsername).toHaveBeenCalled
    expect(mockBlog.getTitle).toHaveBeenCalled
    expect(mockBlog.getContent).toHaveBeenCalled
  })

  test("Update returns a blog composed of the updated database row", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let mockBlog = new Blog()
    let mockUpdatedBlog = await repo.update(mockBlog)
    expect(mockUpdatedBlog.setBlogid).toHaveBeenCalledWith(1)
    expect(mockUpdatedBlog.setUsername).toHaveBeenCalledWith("First User")
    expect(mockUpdatedBlog.setTitle).toHaveBeenCalledWith("First Blog")
    expect(mockUpdatedBlog.setContent).toHaveBeenCalledWith("My content")
    expect(mockUpdatedBlog.setTitleimagepath).toHaveBeenCalledWith("/path/to/image")
  })

  test("Update throws an error when the blog does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    mocked(Blog, true).mockImplementation((): Blog => {
      const mockSetBlogid = jest.fn((value: number) => { })
      const mockGetBlogid = jest.fn((): number => { return 4 })
      const mockSetUsername = jest.fn((value: string) => { })
      const mockGetUsername = jest.fn((): string => { return "First User" })
      const mockSetTitle = jest.fn((value: string) => { })
      const mockGetTitle = jest.fn((): string => { return "Third blog" })
      const mockSetContent = jest.fn((value: string) => { })
      const mockGetContent = jest.fn((): string => { return "My third blog" })
      const mockSetTitleimagepath = jest.fn((value: string) => { })
      const mockGetTitleimagepath = jest.fn((): string => { return "/path/to/image" })
      const mockCreator = jest.fn((username: string): boolean => { return false })

      return {
        blogid: 4,
        username: "First User",
        title: "First Blog",
        content: "My content",
        titleimagepath: "/path/to/image",
        setBlogid: mockSetBlogid,
        getBlogid: mockGetBlogid,
        setUsername: mockSetUsername,
        getUsername: mockGetUsername,
        setTitle: mockSetTitle,
        getTitle: mockGetTitle,
        setContent: mockSetContent,
        getContent: mockGetContent,
        setTitleimagepath: mockSetTitleimagepath,
        getTitleimagepath: mockGetTitleimagepath,
        creator: mockCreator
      }
    })

    let mockBlog = new Blog()
    await expect(repo.update(mockBlog)).rejects.toThrowError("Error: Not found")
  })
})