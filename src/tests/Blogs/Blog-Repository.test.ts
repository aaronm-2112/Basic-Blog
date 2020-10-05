import BlogRepository from '../../Blog/Repositories/BlogPGSQLRepo'
import Blog from '../../Blog/Blog'
import { createDB, resetDB, populateDBWithTestData } from '../../dbinit'
import PGConnection from '../../Common/PGConnection'
import { searchParameters } from '../../Blog/BlogSearchCriteria'

jest.mock('../../Blog/Blog')
jest.mock('../../Common/PGConnection')

describe("Blog repository testing suite", () => {
  beforeEach(async () => {
    let mockConnectionObject = new PGConnection()
    await resetDB(mockConnectionObject)
    await createDB(mockConnectionObject)
    await populateDBWithTestData(mockConnectionObject)
  })


  test("Findall returns all of First User's blogs in the database with expected property values", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let blogs = await repo.findAll(searchParameters.Username, "First User", "1000", "<")
    expect(blogs[0].setBlogid).toHaveBeenCalledWith(2)
    expect(blogs[0].setUsername).toHaveBeenCalledWith("First User")
    expect(blogs[0].setTitle).toHaveBeenCalledWith("Blog Two")
    expect(blogs[0].setContent).toHaveBeenCalledWith("Second blog")
    expect(blogs[0].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233")
  })

  test("Find returns Second User's blog from the database with the expected property values", async () => {
    let mockConnectionObject = new PGConnection()
    let repo = new BlogRepository(mockConnectionObject)
    let mockBlog = await repo.find(searchParameters.Username, "Second User")
    expect(mockBlog.setBlogid(3))
    expect(mockBlog.setUsername("Second User"))
    expect(mockBlog.setContent("First blog"))
    expect(mockBlog.setTitle("Blog One"))
    expect(mockBlog.setTitleimagepath("/uploads/1233"))
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
})