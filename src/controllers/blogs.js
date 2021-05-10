const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch(error){
        next(error)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0
    })
    try{
        await blog.save()
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

module.exports = blogsRouter
