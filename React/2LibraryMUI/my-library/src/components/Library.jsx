import React, { useState, useMemo } from "react";
import BookItem from "./BookItem";

const initialBooks = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

export default function Library() {
  const [books, setBooks] = useState(initialBooks);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [books, query]);

  const addBook = e => {
    e.preventDefault();
    const t = title.trim();
    const a = author.trim();
    if (!t || !a) return;
    const id = Date.now();
    setBooks(prev => [{ id, title: t, author: a }, ...prev]);
    setTitle("");
    setAuthor("");
  };

  const removeBook = id => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="card-main">
      <h2 className="heading">Library Management</h2>

      <div className="controls">
        <input
          className="input search"
          placeholder="Search by title or author"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <form className="add-form" onSubmit={addBook}>
        <input
          className="input small"
          placeholder="New book title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="input small"
          placeholder="New book author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <button className="btn" type="submit">Add Book</button>
      </form>

      <div className="list">
        {filtered.length === 0 ? (
          <div className="empty">No books found</div>
        ) : (
          filtered.map(b => (
            <BookItem key={b.id} book={b} onRemove={() => removeBook(b.id)} />
          ))
        )}
      </div>
    </div>
  );
}
