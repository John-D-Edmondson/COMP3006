import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAtLeastTwoLetter, isValidEmail, isValidPassword } from '../utils/regex';
import {updateUserDetails, createNewUser} from '../Services/userService';


export function DetailsForm({signInOrUpdate, existingUser}) {
    const navigate = useNavigate();
 
    const initialFormData = existingUser
    ? {
        userID: existingUser.userID,
        firstName: existingUser.firstName || '',
        lastName: existingUser.lastName || '',
        email: existingUser.email || '',
        password: '',
        passwordRetype: ''
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRetype: ''
      };

    const [formData, setFormData] = useState(initialFormData);

    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validMatchPassword, setValidMatchPassword] = useState(true);
    const [validFirstName, setValidFirstName] = useState(true);
    const [validLastname, setValidLastName] = useState(true);
    const [detailsUpdated, setDetailsUpdated] = useState(false);
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      

      const formValidation = (userInputs) => {
        let validForm = true;

        if(!isAtLeastTwoLetter(userInputs.firstName)){
          setValidFirstName(false);
          validForm = false;
        } else {
           setValidFirstName(true);
        }

        if(!isAtLeastTwoLetter(userInputs.lastName)){
          setValidLastName(false);
          validForm = false;
        } else { setValidLastName(true)}


        if(!isValidEmail(userInputs.email)) {
          setValidEmail(false);
          validForm = false;
        } else { setValidEmail(true)}         

        if(!isValidPassword(userInputs.password)){
          setValidPassword(false);
          validForm = false;
        } else { setValidPassword(true)}
        
        if(userInputs.password !== userInputs.passwordRetype) {
          setValidMatchPassword(false);
          validForm = false;
        } else { setValidMatchPassword(true)}

        return validForm;

      }

      const handleSignUp = async () => {
        
        let validFormdata = formValidation(formData);
        if (!validFormdata){
          return;
        }
        
        const result = createNewUser(formData);
        if (result){
          navigate(`/login`, { replace: true });  
        } else {
          console.error('Failed to create user');
        }
      };    

      const handleUpdate = async () => {
        let validFormdata = formValidation(formData);
        if (!validFormdata){
          return;
        }

        const result = updateUserDetails(formData);
        if (result){
          setFormData({ ...formData, password: '', passwordRetype:''});
          setDetailsUpdated(true);
        } else {
          console.error('Failed to update user');
          setDetailsUpdated(false);
        }
      }
    
        return (
          <form>

            <h3>{signInOrUpdate === 'update' ? 'Update Details' : 'Sign Up'}</h3>
            <div className="mb-3">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              ></input>
              {!validFirstName && <p style={{ color: 'red' }}>Only letters, at least two</p>}
            </div>
            <div className="mb-3">
              <label>Last name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange} 
              />
              {!validLastname && <p style={{ color: 'red' }}>Only letters, at least two</p>}
            </div>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {!validEmail && <p style={{ color: 'red' }}>Invalid email format</p>}
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {!validPassword && <p style={{ color: 'red' }}>Must be 8 characters and include capital and number.</p>}
            </div>
            <div className="mb-3">
              <label>Re Type Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Re-Enter password"
                name="passwordRetype"
                value={formData.passwordRetype}
                onChange={handleInputChange}
              />
              {!validMatchPassword && <p style={{ color: 'red' }}>Passwords must match</p>}
            </div>
            <div className="d-grid">
            {signInOrUpdate === 'update' ? 
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button> : 
            <button type="button" className="btn btn-primary" onClick={handleSignUp}>Sign Up</button>}
            {detailsUpdated && <p style={{ color: 'red' }}>Details Updated</p>}
              
            </div>

          </form>
        )
      }
