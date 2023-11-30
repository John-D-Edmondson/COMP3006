// bookService.js

// Function to get all books
export const getAllBooks = async () => {
    try {
      const response = await fetch('http://localhost:82/book/getall');
      if (response.ok) {
        const booksData = await response.json();
        return booksData;
      } else {
        console.error('Failed to get books data');
        return null;
      }
    } catch (error) {
      console.error('Error getting books data:', error);
      return null;
    }
  };
  
  // Function to handle returning a book
  export const returnBook = async (bookID, userID) => {
    try {
      const response = await fetch(`http://localhost:82/book/return/${userID}/${bookID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log(`Book with ID ${bookID} returned successfully`);
        // You can return data or handle success as needed
        return true;
      } else {
        console.error(`Failed to return book with ID ${bookID}`);
        // You can handle the error or return false, depending on your needs
        return false;
      }
    } catch (error) {
      console.error('Error returning book:', error);
      // You can handle the error or return false, depending on your needs
      return false;
    }
  };