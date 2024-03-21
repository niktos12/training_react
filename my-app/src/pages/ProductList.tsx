import React, { useEffect } from "react";
import axios from "axios";
import useStore from "../store";
import { useModalStore } from "../store";
import AddProductModal from "../components/AddProduct";
import ProductCard from "../components/Product";

const ProductList: React.FC = () => {
  const { products, fetchProducts } = useStore();
  const { isOpen, openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Add Product
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isOpen && <AddProductModal onClose={closeModal} />}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductList;
