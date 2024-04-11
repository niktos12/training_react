import create from "zustand";
import axios from "axios";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

interface StoreState {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  deleteProduct: (id: number) => Promise<void>;
  editProduct: (id: number, updatedProduct: Product) => Promise<void>;
}

interface ModalState {
  modals: {
    [key: string]: boolean;
  };
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  editProductId: number;
  setEditProductId: (productId: number) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: {},
  openModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
    })),
  closeModal: (modalName) =>
    set((state) => {
      const newModals = { ...state.modals };
      delete newModals[modalName];
      return { modals: newModals };
    }),
  editProductId: -1,
  setEditProductId: (productId) => set({ editProductId: productId }),
}));

export const useStore = create<StoreState>((set) => ({
  products: [],
  fetchProducts: async () => {
    const response = await axios.get("http://localhost:3001/products");
    set({ products: response.data });
  },
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  deleteProduct: async (id) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  },
  setProducts: (products) => set({ products }),
  editProduct: async (id, updatedProduct) => {
    try {
      await axios.put(`http://localhost:3001/products/${id}`, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    }
  },
}));
export default useStore;
