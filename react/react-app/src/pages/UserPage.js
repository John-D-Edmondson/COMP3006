import React, {useEffect} from 'react';
import { useState } from 'react';
import { Book } from "../components/Book"
import { returnBook } from '../Services/bookService';
import { DetailsForm } from '../components/DetailsForm';
import { useNavigate } from 'react-router-dom';
import {fetchUserDetails} from '../Services/userService';

export function UserPage() {
    
    const [user, setUser] = useState(null);
    const [booksBorrowed, setBooksBorrowed] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!authToken) {
        // Handle the case where the authToken is not present
        navigate('/login', { replace: true });
        return;
      }
        
      fetchUserDetails(authToken)
        .then((fetchedUser) => {
          console.log(fetchedUser);
            setUser(fetchedUser);
            setBooksBorrowed(fetchedUser.booksBorrowed);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });

      }, []);



    const handleReturnBook = async (bookID, userID) => {
      console.log(bookID);
      const success = await returnBook(bookID, userID);
      if (success) {
        setBooksBorrowed((booksBorrowed) => booksBorrowed.filter((book) => book.bookDetails.bookID !== bookID));
        // Update state or perform any other necessary actions
        console.log(`Book with ID ${bookID} returned successfully`);
      } else {
        // Handle the case where returning the book failed
        console.error(`Failed to return book with ID ${bookID}`);
      }
    };

    const handleSignOut = () => {
      localStorage.removeItem("authToken");
      navigate('/login', { replace: true });
    }

    const handleLaunchChatroom = () => {
      const url = `http://localhost:3001?&firstname=${user.firstName}&lastname=${user.lastName}&userID=${user.userID}&authToken=${authToken}`;
      window.open(url, '_blank');
    }


  return (

    <div className="user-page">
      {user ? (
      <>
        <h1>{user.firstName} {user.lastName}'s Profile</h1>
        <p>Email: {user.email}</p>
        <button type="button" className="btn btn-primary" onClick={handleSignOut}>Sign Out</button>
        <button type='button' className='btn btn-primary' onClick={handleLaunchChatroom}>Launch Chatroom</button>

        <DetailsForm signInOrUpdate="update" existingUser={user}></DetailsForm>
 
        <h2>Borrowed books</h2>
        {user.booksBorrowed.length > 0 ? (
          
          <div className="books-list">
            {booksBorrowed.map((borrowedBook) => (
              <div key={borrowedBook.bookDetails._id}>
                <Book
                  id={borrowedBook.bookDetails.bookID}
                  title={borrowedBook.bookDetails.title}
                  author={borrowedBook.bookDetails.author}
                  image={borrowedBook.bookDetails.image}
                  blurb={borrowedBook.bookDetails.blurb}
                  borrowed={borrowedBook.bookDetails.borrowed}
                  dateBorrowed={borrowedBook.bookDetails.dateBorrowed}
                  dateReturned={borrowedBook.bookDetails.dateReturned}
                />
                <button onClick={() => handleReturnBook(borrowedBook.bookDetails.bookID, user.userID)}>
                  Return book
                </button>
              </div>
            ))}
          </div>
          
          
        ) : (
          <p>No books borrowed</p>
        )
        }

        
        
      </>
      ) : (
        <p>Loading user details...</p>
    )}
    </div>
  );
};
