import React, { useState } from 'react';
import { loadUserDataFromLocalStorage, updateUserInLocalStorage, updateBookInLocalStorage } from '../testdata/testDataLoader';

export function Book({id, title, author, image, blurb, borrowed, dateBorrowed, dateReturned }) {

    const [isBorrowed, setIsBorrowed] = useState(borrowed);
    const [returnDateState, setReturnState] = useState(dateReturned);

    const handleBorrow = () => {
        const currentDate = new Date();
        const returnDate = new Date(currentDate);
         returnDate.setDate(returnDate.getDate() + 21);

        const updatedBooksData = {  bookID: id,
                                    title: title,
                                    author:author,
                                    image: image,
                                    blurb:blurb,
                                    borrowerID: "1",
                                    dateReturned: returnDate.toLocaleDateString('en-gb'),
                                    dateBorrowed: currentDate.toLocaleDateString('en-gb'),
                                    borrowed: true
                                } 
          updateBookInLocalStorage(updatedBooksData);
          setIsBorrowed(true);
          setReturnState(returnDate.toLocaleDateString('en-gb'));

          const getUserById = (userId) => {
            // Replace this with actual logic to fetch user data (e.g., from localStorage, API, etc.)
            const usersData = loadUserDataFromLocalStorage();
            return usersData.find((user) => user.userID === parseInt(userId, 10));
        };

        const user = getUserById("1");

        const updatedUser = {
            ...user,
            booksBorrowed: [...user.booksBorrowed, id]
          };


        updateUserInLocalStorage(updatedUser);

        
        // You can add additional logic here, such as updating the backend or notifying the user
        console.log(`Book '${title}' borrowed!`);
      };


    return (
        <div className="book">
            <img src= {image} alt={title}></img>
            <h2>{title}</h2>
            <p>{author}</p>
            <p>{blurb}</p>
            <p>{isBorrowed ? 'Borrowed' : 'Available'}</p>
            {isBorrowed && (
            <div>
            <p>Date Available: {returnDateState}</p>
            </div>
              )}
              {!isBorrowed && <button onClick={handleBorrow}>Borrow</button>}

            
        </div>
    )
  }