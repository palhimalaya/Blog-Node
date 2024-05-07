import { useState, useEffect } from "react";
import axios from "axios";
import { X } from 'lucide-react'
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });
  const [categories, setCategories] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`,{
          headers: {
            Authorization: token,
          },
        });
        const post = response.data;
        const tagNames = post.tags.map(tag => tag.name);
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category._id,
          tags: tagNames,
        });
        setLoading(false)
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    if (id) {
      setLoading(true)
      fetchPost();
    }
    fetchCategories();
    fetchTags();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories",{
        headers: {
          Authorization: token,
        },
      
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("/tags",{
        headers: {
          Authorization: token,
        },
      
      });
      setTagOptions(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddNewCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await axios.post("/categories", { name: newCategory },{
          headers: {
            Authorization: token,
          },
        });
        setCategories([...categories, response.data]);
        setFormData({
          ...formData,
          category: response.data._id,
        });
        toast.success(" Category created Successfully ")
        setNewCategory("");
      } catch (error) {
        toast.error("Error creating category")
        console.error("Error adding new category:", error);
      }
    }
  };

  const handleTagChange = (e) => {
    if(formData.tags.some(tag => tag.name === e.target.value)){
      return
    }
    setFormData({
      ...formData,
      tags: [...formData.tags, e.target.value],
    });
  };

  const handleNewTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddNewTag = () => {
    if (newTag.trim() === "") return;
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });
    setNewTag("");
  };

  const handleRemoveTag = (index) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({
      ...formData,
      tags: newTags,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isError = false;
    if(id){
      try {
        await axios.put(`/posts/${id}`, formData,{
          headers: {
            Authorization: token,
          },
        });
        toast.success("Post updated successfully")
      } catch (error) {
        toast.error("Error updating post")
        isError = true;
        console.error("Error updating post:", error);
      }
    }else{
      try {
        await axios.post("/posts", formData,{
          headers: {
            Authorization: token,
          },
        });
        toast.success("Post created successfully")
      } catch (error) {
        toast.error("Error creating post")
        isError = true
        console.error("Error creating post:", error);
      }
    }

    if(!isError){
      navigate("/admin")
    }

  };

  return (
    <div className="flex justify-center mt-5 h-[90%]">
      {
        loading? <div className="text-2xl">Loading...</div>:
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-[50rem]">
          {
            id? <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>:
            <h1 className="text-2xl font-semibold mb-4">Create Post</h1>
          }
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
          <div className="flex items-center">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="New category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 ml-2"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 font-semibold mb-2">Tags</label>
          <div className="flex items-center">
            <select
              id="tags"
              name="tags"
              value=""
              onChange={handleTagChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select existing tag</option>
              {tagOptions.map((tag) => (
                <option key={tag._id} value={tag.name}>{tag.name}</option>
              ))}
            </select>
            <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            placeholder="Enter new tag"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mt-2"
          />
            <button
              type="button"
              onClick={handleAddNewTag}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap">
              {formData.tags.map((tag, index) => (
                <li key={index} className="bg-gray-200 px-2 py-1 text-sm mr-2 mb-2 rounded-md flex items-center">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(index)} className="ml-1">
                    <X className="w-4 h-4 text-red-600 hover:text-red-800 cursor-pointer" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          Submit
        </button>
      </form>
      }
    </div>
  );
};

export default PostForm;
