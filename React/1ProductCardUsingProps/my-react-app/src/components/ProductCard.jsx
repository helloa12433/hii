import React from "react";


export default function ProductCard({ name, price, status }) {
  return (
    <div className="card">
      <h3 className="card-title">{name}</h3>
      <p className="card-price">Price: ${Number(price).toFixed(2)}</p>
      <p className="card-status">Status: {status}</p>
    </div>
  );
}
