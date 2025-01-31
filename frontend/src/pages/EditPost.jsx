import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './EditPost.css'

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts`)
      .then((res) => {
        const post = res.data.find(post => post._id === id);
        setTitle(post.title);
        setOldImage(post.image);
        setDescription(post.description);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);
    formData.append("description", description);

    await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/");
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <img src={oldImage} alt="Current" width="200px" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
