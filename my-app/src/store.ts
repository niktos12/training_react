import create from 'zustand';
import axios from 'axios';
interface Product {
  id: number;
  name: string;
  price: number;
  image:string;
  quantity: number;
  description: string;
}

interface StoreState {
  products: Product[];
  fetchProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => Promise<void>;
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

export const useStore = create<StoreState>((set) => ({
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
  deleteProduct: async (id) => {
    try {
      // Отправляем запрос на удаление на сервер
      await axios.delete(`http://localhost:3001/products/${id}`);
      // Обновляем состояние хранилища, удаляя продукт из списка
      set((state) => ({
        products: state.products.filter((product) => product.id !== id)
      }));
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  }
}));

export default useStore;