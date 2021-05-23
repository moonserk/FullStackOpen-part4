const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')


blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
        response.json(blogs)
    } catch(error){
        next(error)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try{
        const body = request.body
        const decodedToken = jwt.verify(request.token, config.SECRET)
        if (!request.token || !decodedToken.id){
            return response.status(401).json({error: 'token missing or invalid'})
        }

        const user = await User.findById(decodedToken.id)
        console.log(body.userId)
        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(blog)
    }catch(error){
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blogId = request.params.id
        const blog = await Blog.findById(blogId)
        const decodedToken = jwt.verify(request.token, config.SECRET)
        const userid = decodedToken.id

        if(!request.token || !decodedToken.id){
            return response.status(401).json({error: 'token missing or invalid'})
        }

        if(blog.user.toString() === userid.toString()){
            await Blog.findByIdAndRemove(blogId)
            response.status(204).end()
        }else {
            response.status(401).json({error: 'permisson denied'})
        }
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
