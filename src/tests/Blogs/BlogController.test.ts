import request from 'supertest'
import app from '../../app'
import PGConnection from '../../Common/PGConnection'
import { resetDB, createDB, populateDBWithTestData } from '../../dbinit'
import { createJWTCookie } from '../../Common/test-create-jwt'
import User from '../../User/User'
import config from '../../Common/PGConfig'

// jest.mock("../../Common/PGConnection")

async function login() {
  let user = new User()
  user.setUsername('First User')

  return await createJWTCookie(user)
}

describe("Tests for all of the blog resource routes", () => {
  beforeEach(async () => {
    let connectionObject = config('TEST');
    await resetDB(connectionObject)
    await createDB(connectionObject)
    await populateDBWithTestData(connectionObject)
  })


  // afterEach(async () => {
  //   let mockConnectionObject = new PGConnection()
  //   await resetDB(mockConnectionObject)
  // })

  test('Retrieves an undeditable blog in html', async () => {
    const result = await request(app)
      .get('/blogs/1?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(200)
    expect(result.headers["content-type"]).toBe('text/html; charset=utf-8')
    expect(result.text.includes('<h1>Blog One</h1>')).toBe(true)
  })

  test('Retrieves an editable blog in html', async () => {
    const result = await request(app)
      .get('/blogs/1?editPage=true')
      .set('Accept', 'text/html')
      .set('Cookie', await login())
      .send()

    expect(result.status).toBe(200)
    expect(result.headers["content-type"]).toBe('text/html; charset=utf-8')
    expect(result.text.includes('<!-- Upload an image for the header -->')).toBe(true)
    expect(result.text.includes('Title: <input type="text" id="title" value="Blog One">')).toBe(true)
  })

  test('Retrieves an undeditable blog in JSON', async () => {
    const result = await request(app)
      .get('/blogs/1?editPage=false')
      .set('Accept', 'application/json')
      .send()

    expect(result.status).toBe(200)
    expect(result.headers["content-type"]).toBe('application/json; charset=utf-8')
    expect(result.body.title).toBe('Blog One')
  })

  test('Get a 406 when using invalid Accept header in /blogs/:blogid route', async () => {
    const result = await request(app)
      .get('/blogs/1?editPage=false')
      .set('Accept', 'application/jsonnn')
      .send()


    expect(result.status).toBe(406)
  })

  test('Get a 403 when editing a blog you do not own in /blogs/:blogid route[no cookie variant]', async () => {
    const result = await request(app)
      .get('/blogs/1?editPage=true')
      .set('Accept', 'text/html')
      .send()


    expect(result.status).toBe(403)
  })

  test('Get a 403 when editing a blog you do not own in /blogs/:blogid route[cookie variant]', async () => {
    const result = await request(app)
      .get('/blogs/3?editPage=true') // Blog with ID of 3 belongs to Second User + we are signed in as First User
      .set('Accept', 'text/html')
      .set('Cookie', await login())
      .send()


    expect(result.status).toBe(403)
  })


  test('Get a 404 searching for a blog that does not exist', async () => {
    const result = await request(app)
      .get('/blogs/20?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(404)
  })

  test('Get a 400 validation error when using a blogid that is not a number in blogs/:blogid route', async () => {
    const result = await request(app)
      .get('/blogs/heman?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(400)
  })

  test('Get a 400 validation error when using a blogid that is a negative number or 0 in blogs/:blogid route', async () => {
    const resultZeroNumber = await request(app)
      .get('/blogs/0?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(resultZeroNumber.status).toBe(400)

    const resultNegativeNumber = await request(app)
      .get('/blogs/-1?editPage=false')
      .set('Accept', 'text/html')
      .send()

    expect(resultNegativeNumber.status).toBe(400)
  })

  test('Get a 400 validation error when editPage is neither true nor false in blogs/:blogid route', async () => {
    const result = await request(app)
      .get('/blogs/0?editPage=chef')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(400)
  })

  test('Get a 400 validation error when editPage is not provided in blogs/:blogid route', async () => {
    const result = await request(app)
      .get('/blogs/0')
      .set('Accept', 'text/html')
      .send()

    expect(result.status).toBe(400)
  })



  test('Successfully creates a blog ', async () => {
    let user = new User()
    user.setUsername('First User')
    await request(app)
      .post('/blogs')
      .set('Cookie', await createJWTCookie(user))
      .send({ content: "blog", title: "bass" })
      .expect(201)
  })



})
