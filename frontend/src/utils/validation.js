export const validateName = (name) => {
  if (!name || name.length < 20 || name.length > 60)
    return 'Name must be between 20 and 60 characters.';
  return null;
};

export const validateEmail = (email) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email address.';
  return null;
};

export const validatePassword = (password) => {
  if (!password || !/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password))
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character.';
  return null;
};

export const validateAddress = (address) => {
  if (address && address.length > 400)
    return 'Address must be at most 400 characters.';
  return null;
};

export const validateForm = (fields) => {
  for (const msg of Object.values(fields)) {
    if (msg) return msg;
  }
  return null;
};
