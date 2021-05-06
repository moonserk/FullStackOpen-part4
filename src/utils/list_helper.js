const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const blogsWithLikes = blogs.filter(f => f.hasOwnProperty('likes'))
    return blogsWithLikes.length ? blogsWithLikes.map(i => i.likes).reduce((i, j) => i + j) : 0
}

module.exports = {
    dummy,
    totalLikes
}
