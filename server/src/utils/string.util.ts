const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const isSameName = (strA: string, strB: string) =>
  strA.trim().toLowerCase() === strB.trim().toLocaleLowerCase();
