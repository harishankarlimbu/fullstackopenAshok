import React, { useState } from "react";

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const isCreator = blog.user && blog.user.username === currentUser.username;

  return (
    <div style={blogStyle} data-testid="blog-item">
      <div>{blog.title}</div>

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        data-testid="toggle-view"
      >
        {visible ? "Hide" : "view"}
      </button>

      {visible && (
        <div>
          <div>Author: {blog.author}</div>
          <div>URL: {blog.url}</div>

          <div data-testid="likes">Likes: {blog.likes}</div>

          <button
            type="button"
            onClick={() => onLike(blog.id || blog._id)}
            data-testid="like-button"
          >
            like
          </button>

          {isCreator && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `Remove blog "${blog.title}" by ${blog.author}?`
                  )
                ) {
                  onDelete(blog.id || blog._id);
                }
              }}
              data-testid="remove-button"
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;

