import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from "../utils/regex";



export function Login() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {

    if (!isValidEmail(formData.email)) {
      setError('Invalid email address');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:82/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token, userID } = await response.json();
        console.log('Authentication successful. Token:', token);
        localStorage.setItem('authToken', token);
        navigate(`/user`, { replace: true });
        // Handle successful authentication
      } else if (response.status === 401) {
        const { message } = await response.json();
        setError('Authentication failed: ' + message);
      } else if (response.status === 500) {
        setError('Authentication failed: Internal Server Error');
      } else {
        setError('Authentication failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Error during authentication');
    }
  };


  return (
    <form>
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            onChange={handleInputChange}
          />
        </div>
        <div className="d-grid">
          <button type="button" className="btn btn-primary" onClick={handleSignIn}>
            Submit
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </form>
  )
}


