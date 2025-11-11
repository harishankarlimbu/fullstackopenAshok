import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BLOGS_QUERY_KEY = ['blogs']

export const useBlogs = () => {
  return useQuery({
    queryKey: BLOGS_QUERY_KEY,
    queryFn: blogService.getAll,
    enabled: false, // Will be enabled when user is logged in
  })
}

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: blogService.create,
  })
}

export const useLikeBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, blog }) => {
      const updatedData = { likes: (blog.likes || 0) + 1 }
      return blogService.update(id, updatedData)
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (oldBlogs) => {
        if (!oldBlogs) return []
        return oldBlogs.map((blog) => {
          const blogId = blog.id || blog._id
          const updatedId = updatedBlog.id || updatedBlog._id
          if (blogId === updatedId) {
            // Preserve user object if it was a string
            return {
              ...updatedBlog,
              user: typeof updatedBlog.user === 'string' ? blog.user : updatedBlog.user,
            }
          }
          return blog
        })
      })
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (oldBlogs) => {
        if (!oldBlogs) return []
        return oldBlogs.filter((blog) => {
          const blogId = blog.id || blog._id
          return blogId !== deletedId
        })
      })
    },
  })
}

