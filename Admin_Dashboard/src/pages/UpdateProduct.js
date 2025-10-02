import React, { useEffect, useState } from "react";
import { useParams, useHistory, NavLink } from "react-router-dom";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Select,
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import Icon from "../components/Icon";

const UpdateProduct = () => {
  const { slug } = useParams();
  const history = useHistory(); // ✅ React Router v5

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    price: "",
    featured: false,
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(true);

  // Lấy chi tiết product từ API
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load product");
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description,
          slug: data.slug,
          price: data.price,
          featured: data.featured,
          category: data.category ? data.category.id : "",
          image: data.image || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product detail:", err);
        setLoading(false);
      });
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("slug", formData.slug);
    form.append("price", formData.price);
    form.append("featured", formData.featured ? "true" : "false");
    form.append("category", formData.category);
    if (formData.image instanceof File) {
      form.append("image", formData.image);
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/products/${slug}/update`,
        {
          method: "PUT",
          body: form,
        }
      );
      if (!res.ok) throw new Error("Update failed");
      alert("✅ Product updated!");
      history.push("/all-products"); // ✅ điều hướng về danh sách
    } catch (err) {
      console.error("Error updating product:", err);
      alert("❌ Failed to update product");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <PageTitle>Update Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300 mb-4">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <NavLink exact to="/all-products" className="mx-2">
          Products
        </NavLink>
        {">"}
        <p className="mx-2">Update</p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Label>
              <span>Name</span>
              <Input
                className="mb-4"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Label>

            <Label>
              <span>Description</span>
              <Textarea
                className="mb-4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Label>

            <Label>
              <span>Slug</span>
              <Input
                className="mb-4"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                disabled // thường slug không cho sửa
              />
            </Label>

            <Label>
              <span>Price</span>
              <Input
                type="number"
                step="0.01"
                className="mb-4"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Label>

            <Label className="flex items-center space-x-2 mb-4">
              <Input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span>Featured</span>
            </Label>

            <Label>
              <span>Category</span>
              <Select
                className="mb-4"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                <option value="1">Oils & Extracts</option>
                <option value="2">Kitchenware</option>
                <option value="3">Snacks</option>
                <option value="4">Personal Care</option>
              </Select>
            </Label>

            <Label>
              <span>Image</span>
              <Input
                type="file"
                name="image"
                accept="image/*"
                className="mb-4"
                onChange={handleChange}
              />
              {formData.image && !(formData.image instanceof File) && (
                <img
                  src={formData.image}
                  alt="Current"
                  className="w-32 mt-2 rounded"
                />
              )}
            </Label>

            <Button type="submit">Update Product</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdateProduct;
