//Purpose: Basic tests to look for PGSQL comment repository queries for errors.

import CommentRepository from '../../Comments/Repositories/CommentPGSQLRepo'
import Comment from '../../Comments/Comment'
import { createDB, resetDB, populateDBWithTestData } from '../../dbinit'
import PGConnection from '../../Common/PGConnection'
import { mocked } from 'ts-jest/utils'

jest.mock('../../Comments/Comment')
jest.mock('../../Common/PGConnection')


/*
1. Create a functioning databse test -- will require a mock Comment object to be created [Done]
2. Add proper setup and teardown of the test [Done]
3. Account for Jest's test concurrency in within the database setup and teardown or the results will be wrong [Done]
4. Allow the repo being tested to connect using env variables + Create a test table/db in the beforeAll instead of working on the main/production database [Done]
5. Create basic tests of each of the 4 repository methods. [Done]
6. Create a more full test suite. [WIP]
Extras(steps that are optional but can be beneficial): 
  5. Use a different approach for handling Jest's concurrency that does not force tests to run on a single worker

*/

describe("PGSQL Comment repository testing suite", () => {

  beforeEach(async () => {
    //the mock connection object connects to the testing database
    let mockConnectionObject = new PGConnection()
    //await resetDB(mockConnectionObject)
    await createDB(mockConnectionObject)
    await populateDBWithTestData(mockConnectionObject)
  });

  afterEach(async () => {
    let mockConnectionObject = new PGConnection()
    await resetDB(mockConnectionObject)
  })

  test("A comment gets created and returns a valid commentid", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    const mockComment = new Comment()
    let commentid = await repo.create(mockComment)
    expect(commentid).toBeGreaterThanOrEqual(1)
  })

  test("Find returns the expected comment with the expected property values", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    let comment = await repo.find(1)
    //ensure the setters for the resulting mock comment have been called with the correct row values in the repo returned from the find PGSQL query
    expect(comment.setCommentid).toHaveBeenCalledWith(1)
    expect(comment.setUsername).toHaveBeenCalledWith("First User")
    expect(comment.setBlogid).toHaveBeenCalledWith(1)
    expect(comment.setContent).toHaveBeenCalledWith("Good blog!")
    expect(comment.setReply).toHaveBeenCalledWith(false)
    expect(comment.setReplyto).toHaveBeenCalledWith(0)
    expect(comment.setLikes).toHaveBeenCalledWith(0)
    expect(comment.setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31))
    expect(comment.setDeleted).toHaveBeenCalledWith(false)
  })

  test("Find throws error when searching for a comment that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    await expect(repo.find(5)).rejects.toThrowError("Error: Not found")
  })

  test("Findall returns all of the top level comments in blog 1 with the correct values", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    let comments = await repo.findAll(1, false, 0, "likes", 1000, 1000, "next")
    expect(comments.length).toBe(2)
    //ensure first comment has the correct values
    expect(comments[0].setCommentid).toHaveBeenCalledWith(2)
    expect(comments[0].setUsername).toHaveBeenCalledWith("First User")
    expect(comments[0].setBlogid).toHaveBeenCalledWith(1)
    expect(comments[0].setContent).toHaveBeenCalledWith("Okay blog!")
    expect(comments[0].setReply).toHaveBeenCalledWith(false)
    expect(comments[0].setReplyto).toHaveBeenCalledWith(0)
    expect(comments[0].setLikes).toHaveBeenCalledWith(0)
    expect(comments[0].setLikedby).toHaveBeenCalledWith([])
    expect(comments[0].setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31))
    expect(comments[0].setDeleted).toHaveBeenCalledWith(false)

    //ensure the 2nd comment has the correct values
    expect(comments[1].setCommentid).toHaveBeenCalledWith(1)
    expect(comments[1].setUsername).toHaveBeenCalledWith("First User")
    expect(comments[1].setBlogid).toHaveBeenCalledWith(1)
    expect(comments[1].setContent).toHaveBeenCalledWith("Good blog!")
    expect(comments[1].setReply).toHaveBeenCalledWith(false)
    expect(comments[1].setReplyto).toHaveBeenCalledWith(0)
    expect(comments[1].setLikes).toHaveBeenCalledWith(0)
    expect(comments[1].setLikedby).toHaveBeenCalledWith([])
    expect(comments[1].setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31))
    expect(comments[1].setDeleted).toHaveBeenCalledWith(false)

  })

  test("Findall returns no comments when searching for comments in a blog that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    let comments = await repo.findAll(20, false, 0, "likes", 1000, 1000, "next")
    expect(comments.length).toBe(0)
  })

  test("Update successfully updates a row and returns a comment with the changes applied", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    let mockComment = new Comment()
    let mockUpdatedComment = await repo.update(mockComment)

    //test that the mockComment passed in had all of its getters called -- these are used to update the comments table in the database
    expect(mockComment.getCommentid).toHaveBeenCalled
    expect(mockComment.getBlogid).toHaveBeenCalled
    expect(mockComment.getUsername).toHaveBeenCalled
    expect(mockComment.getContent).toHaveBeenCalled
    expect(mockComment.getLikes).toHaveBeenCalled
    expect(mockComment.getLikedby).toHaveBeenCalled
    expect(mockComment.getReply).toHaveBeenCalled
    expect(mockComment.getReplyto).toHaveBeenCalled
    expect(mockComment.getCreated).toHaveBeenCalled
    expect(mockComment.getDeleted).toHaveBeenCalled

    //test that the updated comment returned has all of the values
    expect(mockUpdatedComment.setCommentid).toHaveBeenCalledWith(1)
    expect(mockUpdatedComment.setBlogid).toHaveBeenCalledWith(1)
    expect(mockUpdatedComment.setUsername).toHaveBeenCalledWith("First User")
    expect(mockUpdatedComment.setContent).toHaveBeenCalledWith("Mock content")
    expect(mockUpdatedComment.setLikes).toHaveBeenCalledWith(0)
    expect(mockUpdatedComment.setLikedby).toHaveBeenCalledWith([])
    expect(mockUpdatedComment.setReply).toHaveBeenCalledWith(true)
    expect(mockUpdatedComment.setReplyto).toHaveBeenCalledWith(1)
    expect(mockUpdatedComment.setCreated).toHaveBeenCalledWith(new Date(2001, 0, 31))
    expect(mockUpdatedComment.setDeleted).toHaveBeenCalledWith(false)
  })

  test("Update throws an error when updating a comment that does not exist", async () => {
    let mockConnectionObject = new PGConnection()
    let repo: CommentRepository = new CommentRepository(mockConnectionObject)
    mocked(Comment).mockImplementation((): Comment => {
      const mockSetCommentid = jest.fn((value: number) => { })
      const mockGetCommentid = jest.fn((): number => { return 30 })
      const mockSetBlogid = jest.fn((value: number) => { })
      const mockGetBlogid = jest.fn((): number => { return 1 })
      const mockSetUsername = jest.fn((value: string) => { })
      const mockGetUsername = jest.fn((): string => { return "First User" })
      const mockSetContent = jest.fn((value: string) => { })
      const mockGetContent = jest.fn((): string => { return "Mock content" })
      const mockSetReply = jest.fn((value: boolean) => { })
      const mockGetReply = jest.fn((): boolean => { return true })
      const mockSetReplyto = jest.fn((value: number) => { })
      const mockGetReplyto = jest.fn((): number => { return 1 })
      const mockSetLikes = jest.fn((value: number) => { })
      const mockGetLikes = jest.fn((): number => { return 0 })
      const mockSetLikedby = jest.fn((value: string[]) => { })
      const mockGetLikedby = jest.fn((): string[] => { return [] })
      const mockSetDeleted = jest.fn((value: boolean) => { })
      const mockGetDeleted = jest.fn((): boolean => { return false })
      const mockSetCreated = jest.fn((value: Date) => { })
      const mockGetCreated = jest.fn((): Date => { return new Date(2000, 12, 31) })
      const mockAddLike = jest.fn((username: string): void => { })
      const mockAlreadyLiked = jest.fn((username: string): boolean => { return false })
      const mockMarkDeleted = jest.fn((username: string): void => { })
      const mockEditContent = jest.fn((username: string, content: string): void => { })
      const mockIsOwner = jest.fn((username: string): boolean => { return false })
      return {
        commentid: 1,
        blogid: 1,
        username: "First User",
        content: "First comment",
        reply: false,
        replyto: 0,
        likes: 1,
        likedby: ["First User"],
        deleted: false,
        created: new Date(2000, 12, 31),
        setCommentid: mockSetCommentid,
        getCommentid: mockGetCommentid,
        setBlogid: mockSetBlogid,
        getBlogid: mockGetBlogid,
        setUsername: mockSetUsername,
        getUsername: mockGetUsername,
        setContent: mockSetContent,
        getContent: mockGetContent,
        setReply: mockSetReply,
        getReply: mockGetReply,
        setReplyto: mockSetReplyto,
        getReplyto: mockGetReplyto,
        setLikes: mockSetLikes,
        getLikes: mockGetLikes,
        setLikedby: mockSetLikedby,
        getLikedby: mockGetLikedby,
        setDeleted: mockSetDeleted,
        getDeleted: mockGetDeleted,
        setCreated: mockSetCreated,
        getCreated: mockGetCreated,
        addLike: mockAddLike,
        alreadyLiked: mockAlreadyLiked,
        markDeleted: mockMarkDeleted,
        editContent: mockEditContent,
        isOwner: mockIsOwner
      };
    })
    let mockComment = new Comment()
    await expect(repo.update(mockComment)).rejects.toThrowError("Error: Not found")
  })
})