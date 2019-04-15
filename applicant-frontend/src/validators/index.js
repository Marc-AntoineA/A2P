'use strict';

export function checkPassword(password) {
  if (password === undefined) return false;
  const checkedCharacters = [/[A-Z]/, /[a-z]/, /[0-9]/, /[?|!|@|#|$|%|^|&|*|(|)|-|_]/];
  const nbOccurences = [0, 0, 0, 0];
  const minLength = 10;
  if (password.length < minLength)
    return false;

  for (let letterIndex = 0; letterIndex < password.length; letterIndex++) {
    const letter = password[letterIndex];
    for (let i = 0; i < checkedCharacters.length; i++) {
      if (!checkedCharacters[i].test(letter)) continue;
      nbOccurences[i]++;
      break;
    }
  }

  for (let i = 0; i < checkedCharacters.length; i++) {
    if(nbOccurences[i] < 1) return false;
  }
  return true;
}

export function checkPhone(value) {
  if (value === undefined) return false;
  return /^\+\d{11}$/.test(value);
}

export function checkMailAddress(value) {
  if (value === undefined) return false;
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}
