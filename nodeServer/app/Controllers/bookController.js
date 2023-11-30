const Book = require('../Models/BookModel');
const User = require('../Models/UserModel');
const bookController = {
    getAllBooks: async (req, res) => {
      try {
        const allBooks = await Book.find();
        res.json(allBooks);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    },
    updateBook: async (req, res) => {
        const {bookID} = req.params;
        const updatedBookData = req.body;
        const userID = req.userID;
        
        try {
          const user = await User.findOne({ userID: userID });
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    
           // Add the bookID from the borrowed books array
          user.booksBorrowed.push(bookID);
          await user.save();

          const updatedBook = await Book.findOneAndUpdate({ bookID: bookID }, updatedBookData, { new: true });
          if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
          }
    
          res.json(updatedBook);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      },
    returnBook: async(req, res) => {
      const { userID, bookID } = req.params;
      console.log(userID);
      console.log(bookID);
      try {

        const user = await User.findOne({ userID: userID });
        console.log(user);
        

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

       // Remove the bookID from the borrowed books array
       console.log('Before filter:', user.booksBorrowed);
       user.booksBorrowed = user.booksBorrowed.filter((borrowedBookID) => borrowedBookID != bookID);
       console.log('After filter:', user.booksBorrowed);
       
      await user.save();

        // Find the book by bookID
        const updatedBook = await Book.findOneAndUpdate(
          { bookID: bookID },
          {
            borrowed: false,
            dateBorrowed: '',
            dateReturned: '',
            borrowerID: '',
          },
          { new: true }
        );
    
        if (!updatedBook) {
          return res.status(404).json({ message: 'Book not found' });
        }
    
        res.json(updatedBook);
      } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).send('Internal Server Error');
      }
    }
}

module.exports = bookController;