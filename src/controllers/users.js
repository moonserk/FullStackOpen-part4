const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response, next) => {
    const body = request.body
    
    if(body.password.length < 3){
        return response.status(400).json({
            error: 'Password must be min 3 characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.json(savedUser)
    } catch (error){
        next(error)
    }
})

usersRouter.get('/', async (request, response, next) => {
    try{
        const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
        response.json(users)
    } catch(error){
        next(error)
    }
})

module.exports = usersRouter
