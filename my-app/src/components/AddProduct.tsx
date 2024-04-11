import React, { useState, useEffect } from "react";
import axios from "axios";
import useStore from "../store";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "../store";
import { Dialog } from "@headlessui/react";

interface AddProductModalProps {
  onClose: () => void;
}
export const productSchema = z.object({
  name: z.string().min(3, { message: "Title should be at least 3 characters" }),
  price: z.number().min(1, { message: "Price should be at least 1" }),
  image: z.string().url({ message: "Image should be a valid URL" }),
  quantity: z.number().min(1, { message: "Quantity should be at least 1" }),
  description: z
    .string()
    .min(5, { message: "Description should be at least 5 characters" }),
});
type IProduct = z.infer<typeof productSchema>;
const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const { setProducts } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: "",
      description: "",
      quantity: 1,
    },
  });
  const { modals } = useModalStore();
  const quantity = watch("quantity");
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

  const incrementQuantity = () => {
    setValue("quantity", quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setValue("quantity", quantity - 1);
    }
  };
  const closeAll = () => {
    onClose();
    setIsDialogOpen(false);
  }
  
  const onSubmit = async (data: IProduct) => {
    await axios.post("http://localhost:3001/products", data);
    const response = await axios.get("http://localhost:3001/products");
    setProducts(response.data);
    reset();
    onClose();
    window.location.reload();
  };

  return (
    <>
      {modals.addProduct && (
        <>
          <div className="fixed bg-black/50 top-0 right-0 left-0 bottom-0 h-full"></div>
          <Dialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            className={
              "fixed top-1/2 left-1/2 -translate-x-1/2 z-50 -translate-y-1/2 w-[350px] h-[200px] rounded-3xl bg-black text-white p-4 flex flex-col justify-between"
            }
          >
            <Dialog.Title className={"text-2xl font-bold text-center"}>
              <div className="text-center">Вы точно хотите отменить добавление продукта?</div>
            </Dialog.Title>
            <Dialog.Panel className={"flex flex-row justify-end gap-4 mt-4"}>
              <button className="bg-white text-black rounded py-2 px-4" onClick={() => setIsDialogOpen(false)}>Нет</button>
              <button className=" bg-red-500 text-white rounded py-2 px-4 " onClick={closeAll}>Да</button>
            </Dialog.Panel>
          </Dialog>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded w-[500px] p-5 rounded bg-white z-40 left-1/2 -translate-x-1/2 fixed translate-y-1/2"
          >
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
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
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border p-2 w-full"
                required
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
                required
              ></textarea>
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
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
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="border p-2 w-full"
                required
              />
              {errors.image && (
                <p className="text-red-500">{errors.image.message}</p>
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
                  min={1}
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
      )}
    </>
  );
};

export default AddProductModal;
