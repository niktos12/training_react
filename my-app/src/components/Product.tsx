import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { useStore } from "../store";
import { useModalStore } from "../store";
import { MdEdit } from "react-icons/md";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const { deleteProduct } = useStore();
  const { openModal, modals } = useModalStore();
  const handleEdit = () => {
    openModal("editProduct");
    onEdit(product.id);
  };

  const handleDeleteProduct = () => {
    deleteProduct(product.id);
    window.location.reload();
  };
  const truncatedName =
    product.name.length > 25 ? product.name.slice(0, 25) + "..." : product.name;

  const truncatedDescription =
    product.description.length > 20
      ? product.description.slice(0, 20) + "..."
      : product.description;

  return (
    <div
      className="bg-white rounded-3xl p-4 flex flex-col shadow-xl h-[360px] justify-between transition-all
            ease-in duration-150 items-center relative"
    >
      <Menu as="div" className="inline-block text-right w-full">
        <Menu.Button className="hover:bg-slate-100 hover:rounded-full duration-300 p-2">
          <HiOutlineDotsVertical className="text-3xl" />
        </Menu.Button>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          className={"absolute right-2 mt-2"}
        >
          <Menu.Items className="w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black/5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  className="w-full px-4 py-2 text-lg flex flex-row items-center gap-2"
                  onClick={handleDeleteProduct}
                >
                  <MdDeleteForever className="text-red-500" />
                  <p>Delete</p>
                </button>
              )}
            </Menu.Item>
            <Menu.Items>
              <Menu.Item>
                <button
                  className="w-full px-4 py-2 text-lg flex flex-row items-center gap-2"
                  onClick={handleEdit}
                >
                  <MdEdit className="text-blue-500" />
                  Edit
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu.Items>
        </Transition>
      </Menu>
      <img
        src={product.image}
        className="w-[180px] h-[180px] xm:w-[150px] xm:h-[150px]"
      />
      <p className="font-bold text-xl sm:text-lg">{truncatedName}</p>
      <p className="font-bold text-lg sm:text-lg">{product.price}$</p>
      <p>About product: {truncatedDescription}</p>
      <p>Quantity: {product.quantity}</p>

      <div className="flex flex-row gap-4 items-center">
        <Link to={`/product/${product.id}`}>
          <button className="bg-black text-white rounded-3xl px-4 py-2">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
