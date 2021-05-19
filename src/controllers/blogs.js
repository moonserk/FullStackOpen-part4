const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
        response.json(blogs)
    } catch(error){
        next(error)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = await User.find({})
    console.log(body.userId)
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: user[0]._id
    })
    try{
        const savedBlog = await blog.save()
        user[0].blogs = user[0].blogs.concat(savedBlog._id)
        await user[0].save()
        response.status(201).json(blog)
    }catch(error){
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blogId = request.params.id
        await Blog.findByIdAndRemove(blogId)
        response.status(204).end()
    } catch(error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try{
        // const body = request.body
        const updatedBlog = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0
        }
        await Blog.findByIdAndUpdate({_id: request.params.id}, updatedBlog, {new: true})
        response.json(updatedBlog)
    } catch(error){
        next(error)
    }
})

module.exports = blogsRouter
