import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Login />} />

                <Route path="/products" element={<Products />} />

                <Route path="/products/new" element={<AddProduct />} />

                <Route path="/products/edit/:id" element={<EditProduct />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
