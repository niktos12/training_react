import create from 'zustand';
import axios from 'axios';
interface Product {
  id: number;
  name: string;
  price: number;
}

interface StoreState {
  products: Product[];
  fetchProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}
interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

const useStore = create<StoreState>((set) => ({
  products: [],
  fetchProducts: async () => {
    const response = await axios.get('http://localhost:3001/products');
    set({ products: response.data });
  },
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) => set((state) => ({
    products: state.products.map((p) => (p.id === product.id ? product : p))
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  }))
}));

export default useStore;