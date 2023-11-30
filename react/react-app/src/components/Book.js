import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Book({id, title, author, image, blurb, borrowed, dateBorrowed, dateReturned }) {

    const [isBorrowed, setIsBorrowed] = useState(borrowed);
    const [returnDateState, setReturnState] = useState(dateReturned);

    const navigate = useNavigate();

    const handleBorrow = () => {

      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        // Handle the case where the authToken is not present
        navigate('/login', { replace: true });
        return;
      }
      const currentDate = new Date();
      const returnDate = new Date(currentDate);
      returnDate.setDate(returnDate.getDate() + 21);

      const formattedBorrowedDate = currentDate.toLocaleDateString('en-gb');
      const formattedReturnDate = returnDate.toLocaleDateString('en-GB');

      const updatedBookFields = {
        borrowed: true,
        dateBorrowed: formattedBorrowedDate,
        dateReturned: formattedReturnDate,
      };
  
        //hardcoded user id for now
        fetch(`http://localhost:82/book/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization':  authToken,
          },
          body: JSON.stringify(updatedBookFields),
        })
          .then(response => response.json())
          .then(data => {
            setIsBorrowed(data.borrowed);
            setReturnState(data.dateReturned);
            console.log('Updated book:', data);
            // Handle the updated book data
          })
          .catch(error => console.error('Error updating book:', error));

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