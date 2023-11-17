import React, { useState } from 'react';
import User from '../Models/userModel'; // Import your User model
import { addUserToUserData } from '../testdata/testDataLoader'; // Import your utility functions

export function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Create a new user instance
    const newUser = new User(firstName, lastName, email, password);
  

    // Add the new user to userData
    addUserToUserData(newUser);

    window.location.href = `/user/${newUser.userID}`;

    // Optionally, you can reset the form fields after submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };


    return (
      <form>
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <button type="button" className="btn btn-primary" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/login">Log in</a>
        </p>
      </form>
    )
  }