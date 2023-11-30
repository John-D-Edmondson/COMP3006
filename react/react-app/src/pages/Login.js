import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from "../utils/regex";
import { userSignin } from "../Services/userService";



export function Login() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSignUpHere = () => {
    navigate('/signup', {replace:true});
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {

    if (!isValidEmail(formData.email)) {
      setError('Invalid email address');
      return;
    }

    const result = await userSignin(formData);

    if (result) {
      navigate(`/user`, { replace: true });
    } else {
      console.log("error signing in");

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
        <p></p>
        <button type="button" className="btn btn-secondary" onClick={handleSignUpHere}>Sign Up Here</button>
      </form>
  )
}


