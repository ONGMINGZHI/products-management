import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

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

        // Read role from JWT
        try {
            // token.split(".")
            // This splits the token into HEADER.PAYLOAD.SIGNATURE

            // token.split(".")[1]
            // to get PAYLOAD

            // atob(...) decodes PAYLOAD

            // JSON.parse(...) turn decoded JSON string into JavaScript object.

            const payload = JSON.parse(atob(token.split(".")[1]));

            console.log("JWT payload:", payload);

            setIsAdmin(payload.role === "admin");
        } catch (error) {
            console.error("Invalid token");

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

    const handleBuy = (productName) => {
        alert(`Successfully bought ${productName}!`);
    };

    return (
        <div className="products-container">
            <div className="products-header">
                <h1>Products</h1>

                <div>
                    {/* Only admin can see this */}
                    {isAdmin && <button onClick={() => navigate("/products/new")}>Add New Product</button>}

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
                        {/* Admin sees Edit, users see Buy */}
                        {isAdmin ? <button onClick={() => navigate(`/products/edit/${product._id}`)}>Edit</button> : <button onClick={() => handleBuy(product.name)}>Add to Cart</button>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
