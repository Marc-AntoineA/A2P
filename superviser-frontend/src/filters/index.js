'using strict';

import moment from 'moment';

export function dateFormatter(value) {
  if (!value) return '';
  const m = moment(value);
  return m.format('DD/MM/YY, h:mm a');
}

export function phoneFormatter(value) {
  if (!value) return '';

  let result = '';
  let k = 0;
  for (k = 0; k < value.length / 3; k++) {
    result += value.slice(3*k, 3*(k + 1));
    result += ' ';
  }
  result += value.slice(3*k, value.length);
  return result;
}
