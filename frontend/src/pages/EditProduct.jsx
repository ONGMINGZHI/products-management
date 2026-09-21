import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import EditProductForm from "../components/EditProductForm";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("token");
            navigate("/");
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProduct(response.data);
            } catch (error) {
                console.error(error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                if (error.response?.status === 404) {
                    setError("Product not found");
                    return;
                }

                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleUpdateSuccess = () => {
        setTimeout(() => {
            navigate("/products");
        }, 1000);
    };

    const handleCancel = () => {
        navigate("/products");
    };

    const handleDeleteClick = () => {
        setError("");
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        if (deleting) {
            return;
        }

        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("token");
            navigate("/");
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await api.delete(`/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess("Product deleted successfully");
            setShowDeleteConfirm(false);

            setTimeout(() => {
                navigate("/products");
            }, 1000);
        } catch (error) {
            console.error(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            if (error.response?.status === 404) {
                setShowDeleteConfirm(false);
                setError("Product not found");
                return;
            }

            setShowDeleteConfirm(false);
            setError("Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (error && !product) {
        return (
            <div className="edit-product-container">
                <p className="error">{error}</p>

                <button onClick={() => navigate("/products")}>
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="edit-product-container">
            <h1>Edit Product</h1>

            {error && <p className="error">{error}</p>}

            {success && <p className="success">{success}</p>}

            <EditProductForm
                product={product}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancel}
                onDelete={handleDeleteClick}
            />

            {showDeleteConfirm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h2>Delete Product</h2>

                        <p>
                            Are you sure you want to delete this product?
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="danger-button"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProduct;
