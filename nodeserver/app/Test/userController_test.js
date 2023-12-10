const { expect } = require('chai');
const sinon = require('sinon');
const UserController = require('../Controllers/userController');
const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const Book = require('../Models/BookModel');


describe('UserController', () => {
  describe('signup', () => {
    it('should create a new user successfully', async () => {
      // Mock request and response objects
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'securePassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        send: sinon.spy(),
      };

      // Mock User.findOne to return null (user doesn't exist)
      sinon.stub(User, 'findOne').resolves(null);

// Mock the User constructor and the save method
    sinon.stub(User.prototype, 'save').callsFake(async function () {
        if (!this.userID) {
        // Generate userID if not set (simulate actual behavior)
        this.userID = 12345;
        }
        // Simulate MongoDB's behavior by setting _id
        this._id = 'someGeneratedId';
    
        // Simulate successful save
        return this.toObject(); // Return the saved object
    });

      // Call the signup function
      await UserController.signup(req, res);

      // Assertions
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'User created successfully',
        userID: 12345,
      })).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      User.prototype.save.restore();
    });

    it('should return an error if the user already exists', async () => {
      // Mock request and response objects
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'securePassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        send: sinon.spy(),
      };

      // Mock User.findOne to return an existing user
      sinon.stub(User, 'findOne').resolves({
        _id: 'existingUserId',
        email: 'existing.user@example.com',
        // Other properties relevant to your signup logic
      });
      // Call the signup function
      await UserController.signup(req, res);

      // Assertions
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        message: 'User already exists with this email',
      })).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
    });

    it('should return a 500 status if an error occurs during signup', async () => {
      // Mock request and response objects
      const req = {
        body: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'securePassword',
          },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        send: sinon.spy(),
      };

      // Mock User.findOne to return null (user doesn't exist)
      sinon.stub(User, 'findOne').resolves(null);

      // Mock the User constructor and the save method to throw an error
      sinon.stub(User.prototype, 'save').rejects(new Error('Some error during save'));


      // Call the signup function
      await UserController.signup(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      User.prototype.save.restore();
    });
  });
  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const req = {
        body: {
          email: 'existing.user@example.com',
          password: 'correctPassword',
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        cookie: sinon.spy(),
      };

      // Mock User.findOne to return an existing user
      sinon.stub(User, 'findOne').resolves({
        userID: 'someUserId',
        email: 'existing.user@example.com',
        password: await bcrypt.hash('correctPassword', 10),
      });

      // Mock bcrypt.compare to always return true
      sinon.stub(bcrypt, 'compare').resolves(true);

      await UserController.signIn(req, res);

      // Assertions
      expect(res.status.calledWith(200)).to.be.true;

      const actualResponse = res.json.getCall(0).args[0];
      expect(actualResponse.success).to.be.true;
      expect(actualResponse).to.have.property('token');

      expect(res.cookie.calledWith('authToken')).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      bcrypt.compare.restore();
    });

    it('should return an error for invalid credentials', async () => {
      const req = {
        body: {
          email: 'nonexistent.user@example.com',
          password: 'incorrectPassword',
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        cookie: sinon.spy(),
      };

      // Mock User.findOne to return null (user doesn't exist)
      sinon.stub(User, 'findOne').resolves(null);

      // Mock bcrypt.compare to always return false
      sinon.stub(bcrypt, 'compare').resolves(false);

      await UserController.signIn(req, res);

      // Assertions
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;
      expect(res.cookie.notCalled).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      bcrypt.compare.restore();
    });

    it('should return a 500 status if an error occurs during sign-in', async () => {
      const req = {
        body: {
          // Include valid sign-in data here
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        cookie: sinon.spy(),
      };

      // Mock User.findOne to throw an error
      sinon.stub(User, 'findOne').rejects(new Error('Some error during sign in'));
      await UserController.signIn(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
    });
  });
  describe('getUserDetails', () => {
    it('should return user details with borrowed book information', async () => {
      const req = {
        userID: 'someUserId', // Provide a valid user ID
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };


      const sampleUser = new User({
        userID: 12345,
        firstName: 'jeff',
        lastName: 'test',
        email: 'anemail@test.com',
        password: '12345',
        booksBorrowed:  [1,2]
      });

      const sampleBookDetails = [
        { bookID: 1, title: 'Book 1' },
        { bookID: 2, title: 'Book 2' },
        // Add other relevant book properties
      ];

      // Stub User.findOne to return a stubbed instance of User
      sinon.stub(User, 'findOne').resolves(sampleUser);

      // Stub Book.findOne to return sample book details
      sinon.stub(Book, 'findOne').callsFake(async (query) => {
        const bookID = query.bookID;
        return sampleBookDetails.find((book) => book.bookID === bookID);
      });

      // Call the getUserDetails function
      await UserController.getUserDetails(req, res);

      // Assertions
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const expectedResponse = {
        ...sampleUser.toObject(),
        booksBorrowed: sampleBookDetails.map((bookDetails) => ({ bookDetails })),
      };

      expect(res.json.calledWith(expectedResponse)).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      Book.findOne.restore();
    });

    it('should handle user not found', async () => {
      // Similar setup as the previous test, but stub User.findOne to return null

      const req = {
        userID: 'someNonExistentUserId', // Provide a non-existent user ID
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Stub User.findOne to return null
      sinon.stub(User, 'findOne').resolves(null);

      // Call the getUserDetails function
      await UserController.getUserDetails(req, res);

      // Assertions
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
    });

    it('should handle internal server error', async () => {
      // Similar setup as the previous test, but throw an error during the operation

      const req = {
        userID: 12345, // Provide a valid user ID
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Stub User.findOne to throw an error
      sinon.stub(User, 'findOne').rejects(new Error('Some error during findOne'));

      // Call the getUserDetails function
      await UserController.getUserDetails(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      
      // Restore the stubbed methods to their original state
      User.findOne.restore();
    });
  });
  describe('updateUser', () => {
    it('should update user information and return success message', async () => {
      const req = {
        body: {
          userID: 12345,
          firstName: 'NewFirstName',
          lastName: 'NewLastName',
          email: 'new.email@example.com',
          password: 'newPassword',
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const sampleExistingUser = new User({
        userID: 12345,
        firstName: 'OldFirstName',
        lastName: 'OldLastName',
        email: 'old.email@example.com',
        password: 'oldPassword',
        // Add other relevant user properties
      });

      // Stub User.findOne to return a sample existing user
      sinon.stub(User, 'findOne').resolves(sampleExistingUser);

      // Stub User.prototype.save to simulate successful user update
      sinon.stub(User.prototype, 'save').resolves();

      // Call the updateUser function
      await UserController.updateUser(req, res);

      // Assertions
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'User updated successfully', userID: 12345 })).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      User.prototype.save.restore();
    });

    it('should handle user not found', async () => {
      // Similar setup as the previous test, but stub User.findOne to return null

      const req = {
        body: {
          userID: 'nonExistentUserId',
          // Other update fields
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Stub User.findOne to return null
      sinon.stub(User, 'findOne').resolves(null);

      // Call the updateUser function
      await UserController.updateUser(req, res);

      // Assertions
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
    });

    it('should handle internal server error during update', async () => {
      // Similar setup as the previous test, but stub User.prototype.save to throw an error

      const req = {
        body: {
          userID: 'someUserId',
          // Other update fields
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const sampleExistingUser = new User({
        userID: 'someUserId',
        // Other relevant user properties
      });

      // Stub User.findOne to return a sample existing user
      sinon.stub(User, 'findOne').resolves(sampleExistingUser);

      // Stub User.prototype.save to throw an error
      sinon.stub(User.prototype, 'save').throws(new Error('Some error during save'));

      // Call the updateUser function
      await UserController.updateUser(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      // You can add more specific error handling assertions here if needed

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      User.prototype.save.restore();
    });
  });
});

