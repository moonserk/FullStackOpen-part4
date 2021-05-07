const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const blogsWithLikes = blogs.filter(f => f.hasOwnProperty('likes'))
    return blogsWithLikes.length ? blogsWithLikes.map(i => i.likes).reduce((i, j) => i + j) : 0
}

const favoriteBlog = (blogs) => {
    const likesArray = blogs.filter(f => f.hasOwnProperty('likes')).map(m => m.likes)
    const fblog = blogs[likesArray.indexOf(Math.max(...likesArray))]
    const favorite = likesArray.length ? {
        title: fblog.title,
        author: fblog.author,
        likes: fblog.likes
    } : {}
    return favorite
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
