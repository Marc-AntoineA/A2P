'using strict';

import moment from 'moment';

export function dateFormatter(value) {
  if (!value) return '';
  const m = moment(value);
  return m.format('DD/MM/YY, h:mm a');
}

export function phoneFormatter(value) {
  if (!value) return '';
  return value.slice(0, 3) + ' ' + value.slice(3, 6) + ' '
    + value.slice(6, 9) + ' ' + value.slice(9, 12);
}
