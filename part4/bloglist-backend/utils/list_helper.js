//dummy tset
const dummy=(blogs) => {
    return 1
} 
// 4.4 Total Likes
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
// 4.5 Favorite Blog
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]
  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }
  return favorite
}
// 4.6 Most Blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {} 

  for (let blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  let maxAuthor = null
  let maxBlogs = 0
  for (let author in counts) {
    if (counts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = counts[author]
    }
  }

  return { author: maxAuthor, blogs: maxBlogs }
}
// 4.7 Most Likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = {} 

  for (const blog of blogs) {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes
  }
  let maxAuthor = null
  let maxLikes = 0
  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxAuthor = author
      maxLikes = likesCount[author]
    }
  }

  return { author: maxAuthor, likes: maxLikes }
}


module.exports={dummy ,totalLikes, favoriteBlog , mostBlogs,mostLikes}