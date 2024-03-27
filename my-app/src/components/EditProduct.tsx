import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema} from "./AddProduct"; // Adjust the import path as needed
import { Product } from "../store";
import useStore from "../store"; // Adjust the import path as needed
import { useModalStore } from "../store";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: product, // Use the product object to pre-populate the form
  });

  const { editProduct } = useStore();
  const { modals } = useModalStore();

  const onSubmit = async (updatedProduct: Product) => {
    // Call the editProduct function with the updated product data
    await editProduct(product.id, updatedProduct);
    onClose();
  };

  return (
    <>
      {modals.editProduct && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg z-50"
          >
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="border p-2 w-full rounded-md"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                id="price"
                className="border p-2 w-full rounded-md"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                className="border p-2 w-full rounded-md"
                required
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>
              <input
                {...register("image")}
                type="text"
                id="image"
                className="border p-2 w-full rounded-md"
                required
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.image.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 mb-2">
                Quantity
              </label>
              <input
                {...register("quantity", { valueAsNumber: true })}
                type="number"
                id="quantity"
                className="border p-2 w-full rounded-md"
                required
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default EditProductModal;
