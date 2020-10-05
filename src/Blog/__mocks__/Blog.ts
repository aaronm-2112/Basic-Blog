// Import this named export into your test file:
const mock = jest.fn().mockImplementation(() => {
  const mockSetBlogid = jest.fn((value: number) => { })
  const mockGetBlogid = jest.fn(() => { return 4 })
  const mockSetUsername = jest.fn((value: string) => { })
  const mockGetUsername = jest.fn(() => { return "First User" })
  const mockSetTitle = jest.fn((value: string) => { })
  const mockGetTitle = jest.fn(() => { return "Third blog" })
  const mockSetContent = jest.fn((value: string) => { })
  const mockGetContent = jest.fn(() => { return "My third blog" })
  const mockSetTitleimagepath = jest.fn((value: string) => { })
  const mockGetTitleimagepath = jest.fn(() => { return "/path/to/image" })


  return {
    blogid: 1,
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
    mockGetTitleimagepath: mockGetTitleimagepath
  };
});

export default mock