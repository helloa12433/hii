import React from "react";
import ProductCard from "./components/ProductCard";
import "./styles.css";


const products = [
  { id: 1, name: "Wireless Mouse", price: 25.99, inStock: true },
  { id: 2, name: "Keyboard", price: 45.5, inStock: false },
  { id: 3, name: "Monitor", price: 199.99, inStock: true }
];

export default function App() {
  return (
    <div className="page">
      <div className="instruction-box">
        <h1>Products List</h1>
        <div className="cards-wrapper">
          {products.map(p => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              status={p.inStock ? "In Stock" : "Out of Stock"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
