import React, { useEffect, useState } from "react";
import useStore from "../store";
import { useModalStore } from "../store";
import AddProductModal from "../components/AddProduct";
import ProductCard from "../components/Product";
import EditProductModal from "../components/EditProduct";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import { Product } from "../store";

const ProductList: React.FC = () => {
  // const { products, fetchProducts } = useStore();
  const { openModal, closeModal, modals, editProductId, setEditProductId } = useModalStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextIndex, setNextIndex] = useState(9); 
  useEffect(() => {
    // Загрузка первых 9 продуктов при монтировании компонента
    axios.get<Product[]>('http://localhost:3001/products?_start=0&_end=9')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке продуктов', error);
      });
  }, []);

  const fetchMoreData = () => {
    if (hasMore) {
      // Загрузка следующих 6 продуктов
      axios.get<Product[]>(`http://localhost:3001/products?_start=${nextIndex}&_end=${nextIndex + 5}`)
        .then(response => {
          // Если получен пустой массив, значит, продукты закончились
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
            setProducts(prevProducts => [...prevProducts, ...response.data]);
            setNextIndex(prevIndex => prevIndex + 6);
          }
        })
        .catch(error => {
          console.error('Ошибка при загрузке продуктов', error);
        });
    }
  };

  const handleOpenModal = () => {
    openModal('addProduct');
  };

  const handleEditProduct = (productId: number) => {
    openModal('editProduct');
    setEditProductId(productId);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleOpenModal}
      >
        Add Product
      </button>
      <InfiniteScroll
        dataLength={nextIndex}
        next={fetchMoreData}
        hasMore={hasMore}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {modals.addProduct && <AddProductModal onClose={() => closeModal('addProduct')} />}
        {modals.editProduct && <EditProductModal onClose={() => closeModal('editProduct')} productId={editProductId}/>}
        {products.slice(0, nextIndex).map((product) => (
          <ProductCard key={product.id} product={product} onEdit={handleEditProduct}/>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default ProductList;
