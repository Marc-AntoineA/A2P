
export function checkPassword(password) {
  if (password === undefined) return false;
  const checkedCharacters = [/[A-Z]/, /[a-z]/, /[0-9]/];//, /[?|!|@|#|$|%|^|&|*|(|)|-|_]/];
  const nbOccurences = [0, 0, 0];
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

// Regex from http://phoneregex.com
export function checkPhone(value) {
  if (value === undefined) return false;
  return /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(value);
}

export function checkMailAddress(value) {
  if (value === undefined) return false;
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}
