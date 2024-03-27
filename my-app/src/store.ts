import create from 'zustand';
import axios from 'axios';
export interface Product {
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
  editProduct: (id: number, updatedProduct: Product) => Promise<void>;
}
interface ModalState {
  modals: {
    [key: string]: boolean;
  };
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  editProductId: number | null;
  setEditProductId: (productId: number) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: {},
  openModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    })),
  closeModal: (modalName) =>
    set((state) => {
      const newModals = { ...state.modals };
      delete newModals[modalName];
      return { modals: newModals };
    }),
    editProductId: null,
    setEditProductId: (productId) => set({ editProductId: productId }),
}))

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
  },
  editProduct: async (id, updatedProduct) => {
    try {
      // Отправляем запрос на обновление на сервер
      await axios.put(`http://localhost:3001/products/${id}`, updatedProduct);
      // Обновляем состояние хранилища, обновляя продукт в списке
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        )
      }));
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error);
    }
  }
}));

export default useStore;