import Comment from '../../Comments/Comment';

//Setter and getter testing---------------------------------------------------------
test("Setters and getters for commentid are correct", () => {
  let comment: Comment = new Comment()
  comment.setCommentid(1)
  expect(comment.getCommentid()).toBe(1)
})

test("Setters and getters for blogid are correct", () => {
  let comment: Comment = new Comment()
  comment.setBlogid(2)
  expect(comment.getBlogid()).toBe(2)
})

test("Setters and getters for content are correct", () => {
  let comment: Comment = new Comment()
  comment.setContent("comment")
  expect(comment.getContent()).toBe("comment")
})

test("Setters and getters for created are correct", () => {
  let comment: Comment = new Comment()
  let date = new Date()
  comment.setCreated(date)
  expect(comment.getCreated()).toBe(date)
})


test("Setters and getters for deleted are correct", () => {
  let comment: Comment = new Comment()
  comment.setDeleted(true)
  expect(comment.getDeleted()).toBe(true)

})

test("Setters and getters for likedby are correct", () => {
  let comment: Comment = new Comment()
  comment.setLikedby(["First User"])
  expect(comment.getLikedby()).toStrictEqual(["First User"])

})

test("Setters and getters for likes are correct", () => {
  let comment: Comment = new Comment()
  comment.setLikes(4)
  expect(comment.getLikes()).toBe(4)

})

test("Setters and getters for reply are correct", () => {
  let comment: Comment = new Comment()
  comment.setReply(true)
  expect(comment.getReply()).toBe(true)

})

test("Setters and getters for replyto are correct", () => {
  let comment: Comment = new Comment()
  comment.setReplyto(5)
  expect(comment.getReplyto()).toBe(5)
})

test("Setters and getters for username are correct", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  expect(comment.getUsername()).toBe("First User")
})


//alreadyLiked method testing-------------------------------------------------------------------
test("AlreadyLiked returns false when a client has not yet liked a comment", () => {
  let comment: Comment = new Comment()
  expect(comment.alreadyLiked("First User")).toBe(false)
})

test("AlreadyLiked returns true when a client has already liked a comment", () => {
  let comment: Comment = new Comment()
  comment.addLike("First User")
  expect(comment.alreadyLiked("First User")).toBe(true)
})


//addlike method tests--------------------------------------------------------------------------
test("User adds a like to a comment - total likes will be 1", () => {
  let comment: Comment = new Comment()
  comment.addLike("First User")
  expect(comment.likes).toBe(1)
})

test("User adds a like to a comment - likedby collection will have that user", () => {
  let comment: Comment = new Comment()
  comment.addLike("First User")
  expect(comment.getLikedby().pop()).toBe("First User")
})


test("Throw error when a user attempts to like the same comment more than once", () => {
  let comment: Comment = new Comment()
  comment.addLike("First User")
  expect(() => { comment.addLike("First User") }).toThrow(Error)
})


test("Two users like a comment - total likes will be 2", () => {
  let comment: Comment = new Comment()
  comment.addLike("First User")
  comment.addLike("Second User")
  expect(comment.getLikes()).toBe(2)
})


//isOwner method tests--------------------------------------------------------------------------
test("A user is identified as the owner of a comment", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  expect(comment.isOwner("First User")).toBe(true)
})

test("A user isn't the owner of a comment", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  expect(comment.isOwner("First Client")).toBe(false)
})



//Tests for markDeleted method--------------------------------------------------------------------------
test("Client cannot mark a comment they do not own as deleted", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  expect(() => { comment.markDeleted("First Snoozer") }).toThrow(Error)
})

test("Deleted property is true after comment owner marks their comment as deleted", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  comment.markDeleted("First User")
  expect(comment.getDeleted()).toBe(true)
})

test("Content property is [deleted] after comment owner marks their comment as deleted", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  comment.markDeleted("First User")
  expect(comment.getContent()).toBe("[deleted]")
})


//Tests for editContent method--------------------------------------------------------------------------
test("Comment owner edits the comment content to Silly willie", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  comment.editContent("First User", "Silly willie")
  expect(comment.getContent()).toBe("Silly willie")
})

test("Client gets error when editing the content of their comment that is marked as deleted", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  comment.markDeleted("First User")
  expect(() => { comment.editContent("First User", "Silly willie") }).toThrow(Error)
})

test("Client gets error when attempting to edit the content of a comment they do not own", () => {
  let comment: Comment = new Comment()
  comment.setUsername("First User")
  expect(() => { comment.editContent("First Client", "Silly willie") }).toThrow(Error)
})






