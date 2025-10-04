import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { Card, CardBody, Badge, Button, Avatar } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";

const SingleProduct = () => {
  const { slug } = useParams(); // ✅ đổi id -> slug
  const [tabView, setTabView] = useState("reviews");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleTabView = (viewName) => setTabView(viewName);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        // ✅ chuẩn hóa dữ liệu để không bị lỗi
        setProduct({
          ...data,
          reviews: data.reviews || [],
          rating: data.rating || 0,
          quantity: data.quantity || 0,
          photo: data.image || null, // image từ serializer
          shortDescription: data.description?.slice(0, 50) || "",
          featureDescription: data.description?.slice(0, 100) || "",
          longDescription: data.description || "",
        });
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <PageTitle>Product Details</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        <span className="mx-2">&gt;</span>
        <NavLink exact to="/all-products" className="mx-2 text-purple-600">
          All Products
        </NavLink>
        <span className="mx-2">&gt;</span>
        <p className="mx-2">{product.name}</p>
      </div>

      {/* Product overview */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="grid items-center md:grid-cols-2 lg:grid-cols-2">
            <div>
              {product.photo && (
                <img
                  src={"http://127.0.0.1:8000" + product.photo}
                  alt={product.name || "Product image"}
                  className="w-full rounded-lg"
                />
              )}
            </div>

            <div className="mx-8 pt-5 md:pt-0">
              <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                {product.name}
              </h1>

              <Badge
                type={product.quantity > 0 ? "success" : "danger"}
                className="mb-2"
              >
                <p>{product.quantity > 0 ? `In Stock` : "Out of Stock"}</p>
              </Badge>

              <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                {product.shortDescription}
              </p>
              <p className="mb-3 text-sm text-gray-800 dark:text-gray-300">
                {product.featureDescription}
              </p>

              <p className="text-sm text-gray-900 dark:text-gray-400">
                Product Rating
              </p>
              <div>
                {genRating(product.rating, product.reviews.length, 6)}
              </div>

              <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                ${product.price}
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-400">
                Product Quantity : {product.quantity}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Product Reviews and Description */}
      <Card className="my-8 shadow-md">
        <CardBody>
          {/* Tabs */}
          <div className="flex items-center">
            <Button
              className="mx-5"
              layout="link"
              onClick={() => handleTabView("reviews")}
            >
              {`Reviews (${product.reviews.length})`}
            </Button>
            <Button layout="link" onClick={() => handleTabView("description")}>
              Description
            </Button>
            <Button layout="link" onClick={() => handleTabView("faq")}>
              FAQ
            </Button>
          </div>

          <hr className="mx-3 my-2" />

          {/* Tab Content */}
          <div className="mx-3 mt-4">
            {tabView === "reviews" ? (
              <>
                <p className="text-5xl text-gray-700 dark:text-gray-200">
                  {product.rating.toFixed(1)}
                </p>
                {genRating(product.rating, product.reviews.length, 6)}

                <div className="mt-4">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review, i) => (
                      <div className="flex py-3" key={i}>
                        <Avatar
                          className="hidden mr-3 md:block"
                          size="large"
                          src={review.avatar_url}
                          alt={review.username || "Reviewer"}
                        />
                        <div>
                          <p className="font-medium text-lg text-gray-800 dark:text-gray-300">
                            {review.username}
                          </p>
                          {genRating(review.rate, null, 4)}
                          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                            {review.review}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </>
            ) : tabView === "description" ? (
              <div className="px-3">
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {product.longDescription}
                </p>
              </div>
            ) : tabView === "faq" ? (
              <>FAQ content here...</>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SingleProduct;
