const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {

    test('when list has only one blog', () => {
        const listWithOneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            }
        ]

        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5})
    })

    test('when list has more then one blog', () => {

        const listWithManyBlogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To dered Harmful',
                author: 'NO one lives forever W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 45,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 1235,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go NAH Harmful',
                author: 'Edsger W. Huestra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            }
        ]
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 1235})
    })

    test('when list hasnt any blogs', () => {
        const emptyList = []

        const result = listHelper.favoriteBlog(emptyList)
        expect(result).toEqual({})
    })

    test('when list hasnt "likes" property' , () => {
        const noLikes = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                __v: 0
            }
        ]

        const result = listHelper.favoriteBlog(noLikes)
        expect(result).toEqual({})

    })

})
