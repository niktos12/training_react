import React, { useEffect, useState } from "react";
import { useModalStore } from "../store";
import AddProductModal from "../components/AddProduct";
import ProductCard from "../components/Product";
import EditProductModal from "../components/EditProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Product } from "../store";
import { EndMessage } from "../components/EndMessage";

const ProductList: React.FC = () => {
  const { openModal, closeModal, modals, editProductId, setEditProductId } =
    useModalStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextIndex, setNextIndex] = useState(0); 
  useEffect(() => {
    fetchProducts(); 
  }, []);

  const fetchProducts = () => {
    axios
      .get<Product[]>(`http://localhost:3001/products?_start=${nextIndex}&_end=${nextIndex + 12}`) 
      .then((response) => {
        setProducts(response.data);
        setNextIndex(nextIndex + 12); 
        if (response.data.length < 12) {
          setHasMore(false); 
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке продуктов", error);
      });
  };

  const fetchMoreData = () => {
    axios
      .get<Product[]>(`http://localhost:3001/products?_start=${nextIndex}&_end=${nextIndex + 12}`) 
      .then((response) => {
        setProducts([...products, ...response.data]); 
        setNextIndex(nextIndex + 9); 
        if (response.data.length < 9) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке продуктов", error);
      });
  };

  const handleOpenModal = () => {
    openModal("addProduct");
  };

  const handleEditProduct = (productId: number) => {
    openModal("editProduct");
    setEditProductId(productId);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed bottom-5 right-5 z-10"
        onClick={handleOpenModal}
      >
        Add Product
      </button>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<EndMessage />}
        style={{
          height: "unset",
          overflow: "unset",
        }}
      >
        {modals.addProduct && (
          <AddProductModal onClose={() => closeModal("addProduct")} />
        )}
        {modals.editProduct && (
          <EditProductModal
            onClose={() => closeModal("editProduct")}
            productId={editProductId}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
            />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ProductList;


