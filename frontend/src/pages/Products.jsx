import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // No token
        if (!token) {
            navigate("/");
            return;
        }

        // Empty token
        if (token.trim() === "") {
            localStorage.removeItem("token");
            navigate("/");
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProducts(response.data);
            } catch (error) {
                console.error(error);

                // Invalid or expired token
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                setError("Failed to load products");
            }
        };

        fetchProducts();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="products-container">
            <div className="products-header">
                <h1>Products</h1>

                <div>
                    <button onClick={() => navigate("/products/new")}>Add New Product</button>

                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product._id}>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}

                        <h2>{product.name}</h2>

                        <p>{product.description}</p>

                        <p>
                            <strong>Price:</strong> ${product.price}
                        </p>

                        <p>
                            <strong>Category:</strong> {product.category}
                        </p>

                        <p>
                            <strong>Status:</strong> {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                        <button onClick={() => navigate(`/products/edit/${product._id}`)}>Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
