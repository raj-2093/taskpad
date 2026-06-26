export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addThousandSeparators = (number) => {
  if (number == null || isNaN(number)) return "";

  const [integerPart, fractionalPart] = number.toString().split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
}