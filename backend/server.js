require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Cloudinary Configuration
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET
});

console.log("✅ Cloudinary Configured: ", {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? "" : "Not Set", // Hide API key for security
 });
 

// Set up Multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
       folder: "blog_posts", // Folder name in Cloudinary
       format: async (req, file) => "jpeg", // Convert all uploads to JPEG
       public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique filename
    },
 });
 
 const upload = multer({ storage });

// Blog Post Schema
const PostSchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
});

const Post = mongoose.model("BlogPost", PostSchema);

// Add Post API
app.post("/api/posts", upload.single("image"), async (req, res) => {
   try {
      const { title, description } = req.body;
      const imagePath = req.file.path;

      // Upload Image to Cloudinary
      const result = await cloudinary.uploader.upload(imagePath, { folder: "blog_posts" });

      // Delete Local File After Upload
    //   fs.unlinkSync(imagePath);

      const newPost = new Post({ title, image: result.secure_url, description });
      await newPost.save();
      res.json({ message: "Post added successfully", post: newPost });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Fetch All Posts API
app.get("/api/posts", async (req, res) => {
   try {
      const searchQuery = req.query.search;
      let posts;

      if (searchQuery) {
         posts = await Post.find({
            $or: [
               { title: { $regex: searchQuery, $options: "i" } },
               { description: { $regex: searchQuery, $options: "i" } },
            ],
         });
      } else {
         posts = await Post.find();
      }

      res.json(posts);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


//Update blog post

app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
   try {
      const { title, description } = req.body;
      let image = req.body.image; // Default to existing image

      if (req.file) {
         const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog_posts" });
         image = result.secure_url; // Update image if new image is uploaded
      }

      const updatedPost = await Post.findByIdAndUpdate(
         req.params.id,
         { title, image, description },
         { new: true }
      );

      res.json({ message: "Post updated successfully", post: updatedPost });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

//Delete blog post
app.delete("/api/posts/:id", async (req, res) => {
   try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted successfully" });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));