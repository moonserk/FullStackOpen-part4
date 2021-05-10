const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Test 1',
        author: 'Gregory 1',
        url: 'http://github.com',
        likes: 1
    },
    {
        title: 'Test 2',
        author: 'Gregory 2',
        url: 'http://github.com',
        likes: 2
    },
    {
        title: 'TestFuck',
        author: 'Gregory 3',
        url: 'http://github.com',
        likes: 3
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[1])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[2])
    await blogObj.save()
})

test('blogs are returned json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there three blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length)
})

test('first blog have title Test', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].title).toBe('Test 1')
})

test('a specific blog is within the returned blogs', async () => {
    const res = await api.get('/api/blogs')
    const autors = res.body.map(m => m.author)
    expect(autors).toContain('Gregory 2')
})

test('the unique identifier property of the blog posts is named id', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(() => {
        expect(res.body[0].id).toBeDefined()
    })

})

test('new blog correctly added', async () => {
    const newBlog = {
        title: 'Test 4',
        author: 'Gregory 4',
        url: 'http://github.com',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length + 1)
    const titles = res.body.map(m => m.title)
    expect(titles).toContain('Test 4')

})

test('the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: 'Test undefined likes',
        author: 'Gregory 4',
        url: 'http://github.com',
    }

    const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(res.body.likes).toBeDefined()
    expect(res.body.likes).toBe(0)
})

test('if the title and url properties are missing from the request data, 400 Bad Request', async () => {
    const newBlog = {
        author: 'Gregory 4',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

})

test('delete blog', async () => {
    const res = await api.get('/api/blogs')
    const res2 = await api.delete(`/api/blogs/${res.body[0].id}`).expect(204)
    const res3 = await api.get('/api/blogs')
    expect(res3.body.map(m => m.id)).not.toContain(res.body[0].id)

})

afterAll(() => {
    mongoose.connection.close()
})