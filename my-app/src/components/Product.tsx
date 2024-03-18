import React from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div key={product.id} className="border rounded p-4">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-700">Price: ${product.price}</p>
      <Link to={`/product/${product.id}`} className="text-blue-500">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
