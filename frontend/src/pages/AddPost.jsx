import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AddPost.css";

const AddPost = () => {
  const navigate = useNavigate();

  // Define Validation Schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Only JPG, PNG files are allowed", (value) => {
        return value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      })
      .test("fileSize", "File size must be less than 2MB", (value) => {
        return value && value.size <= 2 * 1024 * 1024;
      }),
  });

  const formik = useFormik({
    initialValues: { title: "", description: "", image: null },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.image);

      try {
        const res = await axios.post("http://localhost:5000/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert(res.data.message);
        navigate("/"); // Redirect to home page after successful submission
      } catch (error) {
        console.error(error);
        alert("Error adding post");
      }
    },
  });

  return (
    <div>
      <h2>Add New Blog Post</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Title Field */}
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && <p className="error">{formik.errors.title}</p>}

        {/* Image Upload Field */}
        <input
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])}
          onBlur={formik.handleBlur}
        />
        {formik.touched.image && formik.errors.image && <p className="error">{formik.errors.image}</p>}

        {/* Description Field */}
        <textarea
          placeholder="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
        {formik.touched.description && formik.errors.description && <p className="error">{formik.errors.description}</p>}

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPost;