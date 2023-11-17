import { Book } from "../components/Book"
// import booksData from '../testdata/booksdata.json'
import React, { useState } from 'react';
import { loadBookDataFromLocalStorage } from "../testdata/testDataLoader";



export function Bookspage() {
  const booksData = loadBookDataFromLocalStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(booksData);

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