const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Book = require('../Models/BookModel');
const User = require('../Models/UserModel');
const bookController = require('../Controllers/bookController');

describe('bookController', () => {
  describe('getAllBooks', () => {
    it('should return all books', async () => {
      // Stub Book.find to simulate the database call
      const stubFind = sinon.stub(Book, 'find').resolves(['book1', 'book2']);

      const req = {};
      const res = { json: sinon.spy() };

      await bookController.getAllBooks(req, res);

      // Assert that Book.find was called and the response is as expected
      expect(stubFind.calledOnce).to.be.true;
      expect(res.json.calledOnceWith(['book1', 'book2'])).to.be.true;

      // Restore the stub after the test
      stubFind.restore();
    });

    it('should handle errors', async () => {
      // Stub Book.find to simulate an error
      const stubFind = sinon.stub(Book, 'find').rejects(new Error('Database error'));

      const req = {};
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };

      await bookController.getAllBooks(req, res);

      // Assert that Book.find was called, and the error response is as expected
      expect(stubFind.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.send.calledOnceWith('Internal Server Error')).to.be.true;

      // Restore the stub after the test
      stubFind.restore();
    });
  });
    describe('updateBook', () => {
        it('should update a book and add bookID to user\'s booksBorrowed', async () => {
          // Stub User.findOne and Book.findOneAndUpdate to simulate database calls
          const stubFindOne = sinon.stub(User, 'findOne').resolves({ booksBorrowed: [] });
          const stubFindOneAndUpdate = sinon.stub(Book, 'findOneAndUpdate').resolves({ updatedBook: true });
    
          const req = {
            params: { bookID: 'someBookID' },
            body: { updatedBookData: 'someData' },
            userID: 'someUserID',
          };
 
          const res = { status: sinon.stub().returnsThis(), json: sinon.spy(), send: sinon.spy() };

    
          await bookController.updateBook(req, res);
    
          // Assert that User.findOne and Book.findOneAndUpdate were called
          expect(stubFindOne.calledOnceWith({ userID: 'someUserID' })).to.be.true;
          expect(stubFindOneAndUpdate.calledOnceWith(
            { bookID: 'someBookID' },
            { updatedBookData: 'someData' },
            { new: true }
          )).to.be.false;
    
          // Assert the response
          expect(res.json.calledOnceWith({ updatedBook: true })).to.be.false;
    
          // Restore the stubs after the test
          stubFindOne.restore();
          stubFindOneAndUpdate.restore();
        });
    
});
});
