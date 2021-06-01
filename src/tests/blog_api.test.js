const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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
    await User.deleteMany({})
    let blogObj = new Blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[1])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[2])
    await blogObj.save()

    const saltRounds = 10
    const passwordHash = await bcrypt.hash('root', saltRounds)

    const user = new User({
        username: 'testroot',
        name: 'rootname',
        passwordHash,
    })

    await user.save()

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

    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'root'
    })

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length + 1)
    const titles = res.body.map(m => m.title)
    expect(titles).toContain('Test 4')

})

test('unauthorized while blog adding', async () => {
    const newBlog = {
        title: 'Test 4',
        author: 'Gregory 4',
        url: 'http://github.com',
        likes: 4
    }

    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'roott'
    })

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

})

test('the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: 'Test undefined likes',
        author: 'Gregory 4',
        url: 'http://github.com',
    }

    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'root'
    })

    const res = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token.body.token)
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

    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'root'
    })

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newBlog)
        .expect(400)

})

test('delete blog', async () => {

    const newBlog = {
        title: 'Test 5',
        author: 'Gregory 4',
        url: 'http://github.com',
        likes: 4
    }

    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'root'
    })

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')

    const blog = res.body.filter(n => n.title === 'Test 5')
    await api
        .delete(`/api/blogs/${blog[0].id}`)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(204)

    const res3 = await api.get('/api/blogs')
    expect(res3.body.map(m => m.id)).not.toContain(blog[0].id)

})

test('updated blog', async () => {
    const updatedBlog ={
        title: 'TestFuck',
        author: 'Gregory 3',
        url: 'http://github.com',
        likes: 99999
    }
    const token = await api.post('/api/login').send({
        username: 'testroot',
        password: 'root'
    })
    const res = await api.get('/api/blogs')
    await api
        .put(`/api/blogs/${res.body[0].id}`)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(updatedBlog)

    const res3 = await api.get('/api/blogs')
    expect(res3.body[0].likes).toBe(99999)
})

afterAll(() => {
    mongoose.connection.close()
})
