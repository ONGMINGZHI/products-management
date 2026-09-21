import { useNavigate } from "react-router-dom";
import AddProductForm from "../components/AddProductForm";

function AddProduct() {
    const navigate = useNavigate();

    const handleSuccess = () => {
        setTimeout(() => {
            navigate("/products");
        }, 1000);
    };

    return (
        <div className="add-product-container">
            <h1>Add New Product</h1>

            <AddProductForm
                onSuccess={handleSuccess}
                onCancel={() => navigate("/products")}
            />
        </div>
    );
}

export default AddProduct;