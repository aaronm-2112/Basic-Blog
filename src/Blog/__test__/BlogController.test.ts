import request from 'supertest'
import app from '../../app'
// import PGConnection from '../../Common/PGConnection'
// import { resetDB, createDB, populateDBWithTestData } from '../../dbinit'


describe("Tests for all of the blog resource routes", () => {
  // beforeEach(async () => {
  //   let mockConnectionObject = new PGConnection()
  //   await resetDB(mockConnectionObject)
  //   await createDB(mockConnectionObject)
  //   await populateDBWithTestData(mockConnectionObject)
  // })

  // Tests for fetching a single blog
  test('Fails to return a blog that does not exist', async () => {

    const result = await request(app)
      .get('/blogs/1?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(404)
  })
})

test('Returns a blog in html', async () => {

})


