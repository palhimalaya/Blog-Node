import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from 'lucide-react';

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`/posts/${id}`,{
          headers: {
            Authorization: token,
          },
        
        });
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - All Posts</h1>
      <Link
        to="/create-post"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Create Post
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="bg-white">
                <td className="border px-4 py-2">{post.title}</td>
                <td className="border px-4 py-2">{post.category?.name}</td>
                <td className="border px-4 py-2">
                  {post.tags.map((tag) => (
                    <span key={tag._id} className="mr-2">
                      {tag.name}
                    </span>
                  ))}
                </td>
                <td className="border px-4 py-2 flex items-center">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Pencil />
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
