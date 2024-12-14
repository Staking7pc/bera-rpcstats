import React, { useState } from 'react';
import './Faucet.css'
const MyComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = async () => {
    // Validate first 4 letters are "tnam"
    if (inputValue.slice(0, 4).toLowerCase() !== 'tnam') {
      setErrorMessage('Input must start with "tnam"');
      return;
    }

    // Remove spaces and convert to lowercase
    const trimmedInput = inputValue.trim().toLowerCase();

    // Validate length is 45 characters
    if (trimmedInput.length !== 45) {
      setErrorMessage('Input must be 45 characters long');
      return;
    }

    // Validate only numbers and alphabets
    if (!/^[a-zA-Z0-9]+$/.test(trimmedInput)) {
      setErrorMessage('Input can only contain alphabets and numbers');
      return;
    }

    try {
      console.log(trimmedInput)
      // Make POST request to the specified URL
      const response = await fetch('https://crossfi-tools.brightlystake.com/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: trimmedInput })
      });

      if (response.ok) {
        // If POST request is successful, set success message
        setSuccessMessage('Request submitted successfully! Please check your balance after 5 minutes');
      } else {
        // If POST request fails, set error message
        setErrorMessage('Failed to trigger API call');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while processing your request');
    }

  };

  return (
    <div className='container'>
      <h2 className='header'>crossfi Faucet by Brightlystake</h2>
      <p></p>
      <input type="text" value={inputValue} onChange={handleChange} />
      <p>Please request this once per day</p>
      <button onClick={handleClick}>Submit</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default MyComponent;
