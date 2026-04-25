

export const validateRequired = (value: string | undefined | null) => value !== undefined && value !== null && value.trim() !== "";

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

export const validatePincode = (pincode: string) => /^[0-9]{6}$/.test(pincode);

export const validateLetters = (value: string) => /^[a-zA-Z\s]+$/.test(value);
