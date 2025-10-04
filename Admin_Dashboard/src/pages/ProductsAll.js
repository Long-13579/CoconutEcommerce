import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Label,
  Select,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import Icon from "../components/Icon";

const ProductsAll = () => {
  const [view, setView] = useState("grid");

  // Pagination
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(8);
  const [totalResults, setTotalResults] = useState(0);

  // Filter + Search
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  function onPageChange(p) {
    setPage(p);
  }

  // Fetch products
  const fetchProducts = () => {
    let url = "http://127.0.0.1:8000/api/products/list_admin";
    if (selectedCategory) {
      url = `http://127.0.0.1:8000/api/products/search?query=${encodeURIComponent(
        selectedCategory
      )}`;
    } else if (searchTerm) {
      url = `http://127.0.0.1:8000/api/products/search?query=${encodeURIComponent(
        searchTerm
      )}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((products) => {
        setTotalResults(products.length);
        setData(
          products.slice((page - 1) * resultsPerPage, page * resultsPerPage)
        );
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, [page, resultsPerPage, selectedCategory, searchTerm]);

  // Delete modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);

  function openModal(product) {
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleDelete() {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${selectedDeleteProduct.slug}/delete`,
        { method: "DELETE" }
      );

      if (res.ok) {
        alert(`✅ Deleted "${selectedDeleteProduct.name}" successfully!`);
        closeModal();
        fetchProducts();
      } else {
        alert(`❌ Delete failed: status ${res.status}`);
        console.error("Delete failed", res);
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("❌ Delete request error");
    }
  }

  // Toggle list / grid
  const handleChangeView = () => {
    setView(view === "list" ? "grid" : "list");
  };

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300 mb-4">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Filter & Search */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center flex-wrap gap-4">
              <Label>
                <Select
                  className="py-2"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Oils & Extracts">Oils & Extracts</option>
                  <option value="Kitchenware">Kitchenware</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Personal Care">Personal Care</option>
                </Select>
              </Label>

              <Label>
                <input
                  type="text"
                  className="py-2 px-3 border rounded"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </Label>

              <Label>
                <input
                  type="number"
                  className="py-2 px-3 border rounded w-28"
                  placeholder="Per page"
                  value={resultsPerPage}
                  onChange={(e) =>
                    setResultsPerPage(Math.max(1, Number(e.target.value)))
                  }
                />
              </Label>
            </div>

            <div>
              <Button
                icon={view === "list" ? ListViewIcon : GridViewIcon}
                className="p-2"
                aria-label="Toggle view"
                onClick={handleChangeView}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Delete modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Delete Product
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete{" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.name}"`}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* List view */}
      {view === "list" ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Action</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-4 md:block"
                        src={"http://127.0.0.1:8000" + product.image}
                        alt="Product image"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">${product.price}</TableCell>
                  <TableCell>
                    <Badge type={product.featured ? "success" : "neutral"}>
                      {product.featured ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {product.category_name ? product.category_name : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Link to={`/products/${product.slug}`}>
                        <Button
                          icon={EyeIcon}
                          className="mr-3"
                          aria-label="Preview"
                        />
                      </Link>
                      <Link to={`/products/${product.slug}/update`}>
                        <Button
                          icon={EditIcon}
                          className="mr-3"
                          layout="outline"
                          aria-label="Edit"
                        />
                      </Link>
                      <Button
                        icon={TrashIcon}
                        layout="outline"
                        onClick={() => openModal(product)}
                        aria-label="Delete"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <>
          {/* Grid view */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {data.map((product) => (
              <div key={product.id} className="relative">
                <Card>
                  <div className="relative">
                    {product.image && (
                      <img
                        className="object-cover w-full h-40"
                        src={"http://127.0.0.1:8000" + product.image}
                        alt={product.name}
                      />
                    )}

                    {/* Featured badge góc trên bên tr */}
                    {(product.featured === true || product.featured === 1 || product.featured === "1") && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                        Featured
                      </span>
                    )}
                  </div>

                  <CardBody>
                    <p className="font-semibold truncate mb-2 text-gray-600 dark:text-gray-300">
                      {product.name}
                    </p>
                    <p className="mb-2 text-purple-500 font-bold text-lg">
                      ${product.price}
                    </p>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                      {product.category_name ? product.category_name : "N/A"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link to={`/products/${product.slug}`}>
                        <Button icon={EyeIcon} className="mr-2" size="small" />
                      </Link>
                      <Link to={`/products/${product.slug}/update`}>
                        <Button
                          icon={EditIcon}
                          className="mr-2"
                          layout="outline"
                          size="small"
                        />
                      </Link>
                      <Button
                        icon={TrashIcon}
                        layout="outline"
                        size="small"
                        onClick={() => openModal(product)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductsAll;