const { expect } = require('chai');
const sinon = require('sinon');
const UserController = require('../Controllers/userController');
const User = require('../Models/UserModel');

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

      console.log(res.status.getCall(0).args); // Check the actual arguments passed to res.status
      console.log(res.json.getCall(0).args);   // Check the actual arguments passed to res.json
      console.log(res.json.getCall(0).args[0]); // Check the actual content passed to res.json


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
      sinon.stub(User.prototype, 'save').throws(new Error('Some error during save'));

      // Call the signup function
      await UserController.signup(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;

      // Restore the stubbed methods to their original state
      User.findOne.restore();
      User.prototype.save.restore();
    });
  });
});
