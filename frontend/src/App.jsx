import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";

const App = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/add-post">Add Post</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
};

export default App;
