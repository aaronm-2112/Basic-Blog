// Import this named export into your test file:
const mock = jest.fn().mockImplementation(() => {
  const mockSetCommentid = jest.fn((value: number) => { })
  const mockGetCommentid = jest.fn(() => { return 1 })
  const mockSetBlogid = jest.fn((value: number) => { })
  const mockGetBlogid = jest.fn(() => { return 1 })
  const mockSetUsername = jest.fn((value: string) => { })
  const mockGetUsername = jest.fn(() => { return "First User" })
  const mockSetContent = jest.fn((value: string) => { })
  const mockGetContent = jest.fn(() => { return "Mock content" })
  const mockSetReply = jest.fn((value: boolean) => { })
  const mockGetReply = jest.fn(() => { return true })
  const mockSetReplyto = jest.fn((value: number) => { })
  const mockGetReplyto = jest.fn(() => { return 1 })
  const mockSetLikes = jest.fn((value: number) => { })
  const mockGetLikes = jest.fn(() => { return 0 })
  const mockSetLikedby = jest.fn((value: number) => { })
  const mockGetLikedby = jest.fn(() => { return [] })
  const mockSetDeleted = jest.fn((value: boolean) => { })
  const mockGetDeleted = jest.fn(() => { return false })
  const mockSetCreated = jest.fn((value: Date) => { })
  const mockGetCreated = jest.fn(() => { return new Date(2000, 12, 31) })

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
    getCreated: mockGetCreated
  };
});

export default mock