import React, { useState } from "react";
import axios from "axios";
import useStore from '../store';

interface AddProductModalProps {
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const { setProducts } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/products', { name, price });
    const response = await axios.get('http://localhost:3001/products');
    setProducts(response.data);
    setName('');
    setPrice(0);
    onClose();
  };

  return (
    <>
      <div className="fixed bg-black/50 top-0 right-0 left-0 bottom-0 h-full"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded w-[500px] p-5 rounded bg-white z-40 left-1/2 -translate-x-1/2 fixed translate-y-1/2"
      >
        <h2 className="text-lg font-bold mb-4">Add Product</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white p-2 mr-2"
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Add Product
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProductModal;
