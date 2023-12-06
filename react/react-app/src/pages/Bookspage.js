import { getAllBooks } from "../Services/bookService";
import { Book } from "../components/Book"
import React, { useState, useEffect } from 'react';

export function Bookspage() {
  const [booksData, setBooksData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Fetch all books when the component mounts
    const fetchBooks = async () => {
      const books = await getAllBooks();
      if (books) {
        setBooksData(books);
        setFilteredBooks(books);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = booksData.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genres.some((genre) => genre.toLowerCase().includes(query.toLowerCase()))

    );

    setFilteredBooks(filtered);
  };

    return (
      <div className="books-page">
        <h1>All Books</h1>
        
        <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={handleSearch}
        />
        </div>
        
        <div className="books-list">
          {
            filteredBooks.map((book, index)=> {
              return (<Book
                id={book.bookID}
                key={book.bookID}
                title={book.title}
                author={book.author}
                image={book.image}
                blurb={book.blurb}
                borrowed={book.borrowed}
                dateBorrowed={book.dateBorrowed}
                dateReturned={book.dateReturned}
                />
              )
            })
          }
        </div>
        </div>
      
    )
  }