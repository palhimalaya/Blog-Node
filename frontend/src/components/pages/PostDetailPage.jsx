import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { Pencil, Trash2 } from "lucide-react";
import AlertModal from "../AlertModal";

const PostDetailPage = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `/posts/${id}/comments`,
        { content: commentText },
        { headers: { Authorization: token } }
      );
      const newComment = response.data.comment;
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, newComment],
      }));
      toast.success("Comment added successfully");
      setCommentText("");
    } catch (error) {
      toast.error("Please Login to add a comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleEdit = (commentId) => {
    const comment = post.comments.find((comment) => comment._id === commentId);
    setEditingCommentId(commentId);
    setEditedCommentText(comment.content);
  };

  const handleUpdate = async (commentId) => {
    try {
      await axios.put(
        `/comments/${commentId}`,
        { content: editedCommentText },
        { headers: { Authorization: token } }
      );
      const updatedComments = post.comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, content: editedCommentText }
          : comment
      );
      setPost((prevPost) => ({ ...prevPost, comments: updatedComments }));
      toast.success("Comment updated successfully");
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${deletingCommentId}`, {
        headers: { Authorization: token },
      });
      const updatedComments = post.comments.filter(
        (comment) => comment._id !== deletingCommentId
      );
      setPost((prevPost) => ({ ...prevPost, comments: updatedComments }));
      toast.success("Comment deleted successfully");
      closeModal();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting comment:", error);
      closeModal();
    }
  };

  const openModal = (postId) => {
    setDeletingCommentId(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-center">
          <p className="text-2xl font-semibold mb-4">Loading...</p>
          {/* <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div> */}
        </div>
      ) : (
        <div className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-md mt-4">
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          <p className="text-gray-600 mb-2">Author: {post.author.full_name}</p>
          <p className="text-gray-700 break-words">{post.content}</p>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Add Comment</h3>
            {!user?._id && (
              <p className="text-gray-600 mb-2">
                Please{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  login
                </a>{" "}
                to add a comment
              </p>
            )}
            <form onSubmit={handleSubmitComment}>
              <textarea
                className="w-full h-24 p-2 border rounded"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-end"
              >
                Post Comment
              </button>
            </form>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Comments</h3>
            {post.comments?.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-100 p-4 mb-2 rounded-lg"
              >
                {editingCommentId === comment._id ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                    ></textarea>
                    <div className="mt-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleUpdate(comment._id)}
                      >
                        Update
                      </button>
                      <button
                        className="px-3 py-1 ml-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex item-center">
                    <div>
                      <p className="text-gray-600">{comment.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted by {comment.author.full_name}
                      </p>
                    </div>
                    {(user?._id === comment.author._id ||
                      user?.role === "admin") && (
                      <div className="ml-auto flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(comment._id)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => openModal(comment._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {post.comments.length === 0 && <p>No comments yet.</p>}
          </div>
        </div>
      )}
      <AlertModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
};

export default PostDetailPage;
