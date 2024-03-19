import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  // Добавьте другие поля, если они есть в вашем товаре
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`http://localhost:3001/products/${id}`);
      setProduct(response.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-700">Price: ${product.price}</p>
      {/* Добавьте другие детали товара, если они есть */}
      <Link to={`/training_react`}>Back to Products</Link>
    </div>
  );
};

export default ProductDetail;