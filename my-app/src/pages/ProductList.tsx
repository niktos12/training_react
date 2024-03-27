import React, { useEffect } from "react";
import useStore from "../store";
import { useModalStore } from "../store";
import AddProductModal from "../components/AddProduct";
import ProductCard from "../components/Product";
import EditProductModal from "../components/EditProduct";

const ProductList: React.FC = () => {
  const { products, fetchProducts } = useStore();
  const { openModal, closeModal, modals, editProductId } = useModalStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);
  const handleOpenModal = () => {
    openModal('addProduct');
  };
  const handleEditProduct = (productId: number) => {
    // Найдите продукт по его id
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      // Если продукт найден, откройте модальное окно для редактирования
      openModal('editProduct');
    } else {
      // Если продукт не найден, вы можете обработать этот случай, если необходимо
      console.error(`Product with id ${productId} not found`);
    }
  };
  const productToEdit = typeof editProductId === 'number' ? products.find((product) => product.id === editProductId) : undefined;
  // const handleEditProduct = (productId: number) => {
  //   openModal('editProduct');
  // };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleOpenModal}
      >
        Add Product
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modals.addProduct && <AddProductModal onClose={() => closeModal('addProduct')} />}
      {modals.editProduct && <EditProductModal onClose={() => closeModal('editProduct')} product={productToEdit} />}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onEdit={handleEditProduct}/>
        ))}
      </div>
    </>
  );
};

export default ProductList;
