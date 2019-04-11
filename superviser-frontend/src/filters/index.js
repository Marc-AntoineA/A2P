'using strict';

import moment from 'moment';

export function dateFormatter(value) {
  if (!value) return '';
  const m = moment(value);
  return m.format('DD/MM/YY, h:mm:ss a');
}
