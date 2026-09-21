import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function AddProductForm({ onSuccess, onCancel }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        inStock: true,
        imageUrl: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

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
            navigate("/");
            return;
        }

        if (!formData.name.trim()) {
            setError("Product name is required");
            return;
        }

        if (
            formData.price === "" ||
            isNaN(formData.price) ||
            Number(formData.price) <= 0
        ) {
            setError("Price must be a positive number");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/products",
                {
                    name: formData.name.trim(),
                    description: formData.description,
                    price: Number(formData.price),
                    category: formData.category,
                    inStock: formData.inStock,
                    imageUrl: formData.imageUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Product created successfully");

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                inStock: true,
                imageUrl: "",
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            setError(
                error.response?.data?.error ||
                "Failed to create product"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/products");
        }
    };

    return (
        <div className="add-product-form">
            {error && <p className="error">{error}</p>}

            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Product Name</label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                    />
                </div>

                <div>
                    <label htmlFor="price">Price</label>

                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        step="0.01"
                        min="0"
                    />
                </div>

                <div>
                    <label htmlFor="category">Category</label>

                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                        />

                        {" "}In Stock
                    </label>
                </div>

                <div>
                    <label htmlFor="imageUrl">Image URL</label>

                    <input
                        id="imageUrl"
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Product"}
                </button>

                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default AddProductForm;