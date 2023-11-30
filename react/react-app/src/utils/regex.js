export const isValidEmail = (email) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

export const isAtLeastTwoLetter = (text) => {
  const atLeastTwoLetterRegex = /^[^\d\W_]*[a-zA-Z][^\d\W_]*[a-zA-Z][^\d\W_]*$/;
  console.log (atLeastTwoLetterRegex.test(text));
  return atLeastTwoLetterRegex.test(text);
}