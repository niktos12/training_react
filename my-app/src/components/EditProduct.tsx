import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Product } from "../store";
import useStore from "../store";
import { useModalStore } from "../store";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "./AddProduct";
import { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

interface EditProductModalProps {
  productId: number;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  productId,
  onClose,
}) => {
  const { editProduct } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const { closeModal, modals } = useModalStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDialogOpen) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDialogOpen]);

  const closeAll = () => {
    onClose();
    setIsDialogOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
  });
  const incrementQuantity = () => {
    setValue("quantity", Number(watch("quantity")) + 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const decrementQuantity = () => {
    const currentQuantity = Number(watch("quantity"));
    if (currentQuantity > 1) {
      setValue("quantity", currentQuantity - 1, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };
  useEffect(() => {
    axios
      .get<Product[]>(`http://localhost:3001/products`)
      .then((response) => {
        setProducts(response.data);
        const productToEdit = response.data.find(
          (product) => product.id === productId
        );
        reset(productToEdit);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке продуктов:", error);
      });
  }, [productId, reset]);

  const onSubmit = async (updatedProduct: Product) => {
    try {
      await editProduct(productId, updatedProduct);
      closeModal("editProduct");
      reset();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    }
  };

  return (
    <>
      {modals.editProduct && (
        <>
          <div className="fixed bg-black/50 top-0 right-0 left-0 bottom-0 h-full w-full z-40"></div>
          <Dialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            className={
              "fixed top-1/2 left-1/2 -translate-x-1/2 z-50 -translate-y-1/2 w-[350px] h-[200px] rounded-3xl bg-black text-white p-4 flex flex-col justify-between"
            }
          >
            <Dialog.Title className={"text-2xl font-bold text-center"}>
              <div className="text-center">
                Вы точно хотите отменить редактирование продукта?
              </div>
            </Dialog.Title>
            <Dialog.Panel className={"flex flex-row justify-end gap-4 mt-4"}>
              <button
                className="bg-white text-black rounded py-2 px-4"
                onClick={() => setIsDialogOpen(false)}
              >
                Нет
              </button>
              <button
                className=" bg-red-500 text-white rounded py-2 px-4 "
                onClick={closeAll}
              >
                Да
              </button>
            </Dialog.Panel>
          </Dialog>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg z-50 w-1/3"
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
              <div className="flex items-center">
                <input
                  {...register("quantity", { valueAsNumber: true })}
                  type="number"
                  id="quantity"
                  className="border p-2 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="border p-2 rounded-l-md"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="border p-2 rounded-r-md"
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <p className="text-red-500">{errors.quantity.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
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
