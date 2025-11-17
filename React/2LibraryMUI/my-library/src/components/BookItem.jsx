import React from "react";

export default function BookItem({ book, onRemove }) {
  return (
    <div className="book-row">
      <div>
        <strong className="book-title">{book.title}</strong>
        <div className="book-author">by {book.author}</div>
      </div>
      <div>
        <button className="btn remove" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
