import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { loadUserDataFromLocalStorage, loadBookDataFromLocalStorage, updateUserInLocalStorage, updateBookInLocalStorage } from '../testdata/testDataLoader';

export function UserPage() {


        const { id } = useParams();

        const getUserById = (userId) => {
            // Replace this with actual logic to fetch user data (e.g., from localStorage, API, etc.)
            const usersData = loadUserDataFromLocalStorage();
            return usersData.find((user) => user.userID === parseInt(userId, 10));
        };

        const [user, setUser] = useState(getUserById(id));

        if (!user) {
            return <div>User not found</div>;
        }

        const handleReturnBook = (bookID) => {
            const updatedUser = {
                ...user,
                booksBorrowed: user.booksBorrowed.filter((id) => id !== bookID),
              };
            updateUserInLocalStorage(updatedUser);

            const booksData = loadBookDataFromLocalStorage();
            const book = booksData.find((book) => book.bookID === bookID);
            const updatedBooksData = { ...book,
                                        borrowerID: "",
                                        dateReturned: "",
                                        dateBorrowed: "",
                                        borrowed: false
                                    } 
           
              updateBookInLocalStorage(updatedBooksData);


            setUser(updatedUser);
                 
        }

  return (
    <div className="user-page">
      <h1>{user.firstname}'s {user.lastname} Details</h1>
      <p>Email: {user.email}</p>

      <h2>Borrowed Books</h2>
      <ul>
        {user.booksBorrowed.map((bookID) => {
          const booksData = loadBookDataFromLocalStorage();
          const book = booksData.find((book) => book.bookID === bookID);

          if (book) {
            return (
              <li key={book.bookID}>
                <strong>{book.title}</strong>
                <p>Borrowed Date: {book.dateBorrowed}</p>
                <p>Return Date: {book.dateReturned}</p>
                
                  <button onClick={() => handleReturnBook(book.bookID)}>
                    Return Book
                  </button>
                

              </li>
            );
          } else {
            // Handle the case where the book with the given ID is not found
            return <li key={bookID}>Book not found</li>;
          }
        })}
      </ul>
    </div>
  );
};

    