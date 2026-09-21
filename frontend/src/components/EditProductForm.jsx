import { useEffect, useState } from "react";
import api from "../utils/api";

function EditProductForm({ product, onSuccess, onCancel, onDelete }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        inStock: true,
        imageUrl: "",
    });

    const [originalData, setOriginalData] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!product) {
            return;
        }

        const data = {
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "",
            inStock: product.inStock ?? true,
            imageUrl: product.imageUrl || "",
        };

        setFormData(data);
        setOriginalData(data);
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("token");
            setError("Your session has expired. Please log in again.");
            return;
        }

        if (!formData.name.trim()) {
            setError("Product name is required");
            return;
        }

        if (formData.price === "" || isNaN(formData.price) || Number(formData.price) <= 0) {
            setError("Price must be a positive number");
            return;
        }

        const updatedFields = {};

        if (formData.name !== originalData.name) {
            updatedFields.name = formData.name.trim();
        }

        if (formData.description !== originalData.description) {
            updatedFields.description = formData.description;
        }

        if (Number(formData.price) !== Number(originalData.price)) {
            updatedFields.price = Number(formData.price);
        }

        if (formData.category !== originalData.category) {
            updatedFields.category = formData.category;
        }

        if (formData.inStock !== originalData.inStock) {
            updatedFields.inStock = formData.inStock;
        }

        if (formData.imageUrl !== originalData.imageUrl) {
            updatedFields.imageUrl = formData.imageUrl;
        }

        if (Object.keys(updatedFields).length === 0) {
            setError("No changes were made");
            return;
        }

        try {
            setLoading(true);

            const response = await api.patch(`/products/${product._id}`, updatedFields, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess("Product updated successfully");

            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("token");
                setError("Your session has expired. Please log in again.");
                return;
            }

            if (error.response?.status === 404) {
                setError("Product not found");
                return;
            }

            setError(error.response?.data?.error || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-product-form">
            {error && <p className="error">{error}</p>}

            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Product Name</label>

                    <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" />
                </div>

                <div>
                    <label htmlFor="description">Description</label>

                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description" />
                </div>

                <div>
                    <label htmlFor="price">Price</label>

                    <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" step="0.01" min="0" />
                </div>

                <div>
                    <label htmlFor="category">Category</label>

                    <input id="category" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" />
                </div>

                <div>
                    <label>
                        <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} /> In Stock
                    </label>
                </div>

                <div>
                    <label htmlFor="imageUrl">Image URL</label>

                    <input id="imageUrl" type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Enter image URL" />
                </div>

                <div className="edit-product-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Product"}
                    </button>

                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>

                    <button type="button" className="danger-button" onClick={onDelete} disabled={loading}>
                        Delete Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProductForm;
