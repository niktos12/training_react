import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductInfo";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/" element={<ProductList/>} />
      </Routes>
    </Router>
  );
}

export default App;
