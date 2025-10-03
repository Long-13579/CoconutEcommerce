import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon, PublishIcon, StoreIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Select,
} from "@windmill/react-ui";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    slug: "",
    image: null,
    featured: false,
    category: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("slug", formData.slug);
      if (formData.image) {
        data.append("image", formData.image);
      }
      data.append("featured", formData.featured ? "true" : "false");
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);

      const res = await fetch("http://127.0.0.1:8000/api/products/create", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to create product");

      const result = await res.json();
      alert("✅ Product created successfully!");
      console.log(result);

      // reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        slug: "",
        image: null,
        featured: false,
        category: "",
        quantity: "",
      });
    } catch (err) {
      console.error("❌ Error creating product:", err);
      alert("❌ Failed to create product. Check console for details.");
    }
  };

  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3"
      >
        {/* Card trái */}
        <Card className="row-span-2 md:col-span-2">
          <CardBody>
            <FormTitle>Product Name</FormTitle>
            <Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4"
                placeholder="Type product name here"
              />
            </Label>
            
            <FormTitle>Product quantity</FormTitle>
            <Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mb-4"
                placeholder="Enter product quantity here"
              />
            </Label>

            <FormTitle>Description</FormTitle>
            <Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mb-4"
                rows="4"
                placeholder="Enter product description here"
              />
            </Label>

            <FormTitle>Product Price</FormTitle>
            <Label>
              <Input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mb-4"
                placeholder="Enter product price here"
              />
            </Label>

            <FormTitle>Slug</FormTitle>
            <Label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="mb-4"
                placeholder="Auto-generated if left empty"
              />
            </Label>

            <FormTitle>Product Image</FormTitle>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mb-4 text-gray-800 dark:text-gray-300"
            />

            <FormTitle>Featured</FormTitle>
            <Label className="flex items-center space-x-2 mb-4">
              <Input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span>Mark as Featured</span>
            </Label>

            <div className="w-full">
              <Button type="submit" size="large" iconLeft={AddIcon}>
                Add Product
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Card phải */}
        <Card className="h-48">
          <CardBody>
            <div className="flex mb-8">
              <Button layout="primary" className="mr-3" iconLeft={PublishIcon}>
                Publish
              </Button>
              <Button layout="link" iconLeft={StoreIcon}>
                Save as Draft
              </Button>
            </div>
            <Label className="mt-4">
              <FormTitle>Select Product Category</FormTitle>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1"
              >
                <option value="">-- Select Category --</option>
                <option value="1">Oils & Extracts</option>
                <option value="2">Kitchenware</option>
                <option value="3">Snacks</option>
                <option value="4">Personal Care</option>
              </Select>
            </Label>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default AddProduct;
