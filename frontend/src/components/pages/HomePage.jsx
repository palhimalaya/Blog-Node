import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/posts?page=${page}`);
        const newPosts = response.data;
        console.log(newPosts)
        setPosts((prevPosts) => {
          const filteredNewPosts = newPosts.filter((post) => !prevPosts.find((p) => p._id === post._id));
          return [...prevPosts, ...filteredNewPosts];
        });
        setHasMore(newPosts.length > 0);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Blog Posts</h1>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link to={`/post/${post._id}`}   key={post._id}>
            <div
              className="p-4 bg-white shadow-lg mb-4 rounded-lg"
              >
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
              <p className="text-gray-600 mt-2">Author: {post.author.full_name}</p>
            </div>
            </Link>
          ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className="block mx-auto mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load More
        </button>
      )}
      {!loading && !hasMore && (
        <p className="text-center mt-4">No more posts to load.</p>
      )}
    </div>
  );
};

export default HomePage;
