import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const postsPerPage = 3; // Number of posts per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase())
  );

  // *Pagination Logic*
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    }
  };

  return (
    <div>
      <h2>Blog Posts</h2>

      {/* Search Input Field */}
      <div className="search-container">
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
    </div>
      {/* Display Filtered & Paginated Posts */}
      {currentPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        currentPosts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <img src={post.image} alt={post.title} width="300px" />
            <p>{post.description}</p>
            <button className="edit-btn" onClick={() => navigate(`/edit-post/${post._id}`)}>Edit</button>
            <button className="del-btn" onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;