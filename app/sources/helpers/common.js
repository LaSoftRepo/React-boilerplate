
const CAPITALIZE_EVERY_REGEX = /(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g;
const VALIDATION_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const NUM_GROUP_REGEX        = /\B(?=(\d{3})+(?!\d))/g;
const SPLIT_VALUE_UNIT_REGEX = /^(\d+)(\S*)/;
const FILE_PATH_REGEX        = /[^./\\]*$/;
const SEPARATOR_REGEX        = /[-_]/;

/*
 * String & Formatters
 */

// Usage:
// capitalize('lorem ipsum dolor')       => 'Lorem ipsum dolor'
// capitalize('lorem ipsum dolor', true) => 'Lorem Ipsum Dolor'

export function capitalize(string, words = false) {
  if (!string)
    return '';

  if (words)
    return string.replace(CAPITALIZE_EVERY_REGEX, m => m.toUpperCase());

  return string.charAt(0).toUpperCase() + string.substring(1);
}

// Usage:
// formatNumber(10000) => 10,000

export function formatNumber(value) {
  if (!value) return '0';
  let parts = value.toString().split('.');
  parts[0] = parts[0].replace(NUM_GROUP_REGEX, ',');
  return parts.join('.');
}

// Usage:
// const { value, unit } = parseValueUnit('100%'); or 100 %, or 5 em etc
// value = 100
// unit  = %

export function parseValueUnit(input, trim = true) {
  if (typeof input !== 'string') return { value: 0, unit: '' };
  const [value, unit] = compact(input.split(SPLIT_VALUE_UNIT_REGEX));
  return { value: +value, unit: trim && unit ? unit.trim() : unit };
}

// Usage:
// capitalize(unsnakeString('company_id'), true) => 'Company Id'
// capitalize(unsnakeString('hello-world'))      => 'Hello world'

export function unsnakeString(str, rejoinChar = ' ') {
  return str.replace(SEPARATOR_REGEX, rejoinChar);
}

/*
 * Path
 */

// Usage:
// getExtension('/assets/icon.svg') => 'svg'

export function getExtension(filename, preserveCase = false) {
  if (!filename) return '';
  let extention = (FILE_PATH_REGEX.exec(filename) || [''])[0];
  return preserveCase ? extention : extention.toLowerCase();
}



/*
 * Validators
 */

export function validateEmail(email) {
  return VALIDATION_EMAIL_REGEX.test(email);
}


/*
 * Runtime Type Checking
 */

export function isBoolean(arg) {
  return typeof arg === 'boolean';
}

export function isNumber(arg) {
  return !Array.isArray(arg) && (arg - (+arg) + 1) >= 0;
}

export function isInteger(arg, isSafe = true) {
  return isSafe ? Number.isSafeInteger(arg) : Number.isInteger(arg);
}

export function isFunction(arg) {
  return typeof arg === 'function';
}

export function isString(arg) {
  return typeof arg === 'string';
}

export function isArray(arg) {
  return Array.isArray(arg);
}

export function isTypedArray(arg) {
  return !!arg && arg.buffer && arg.buffer.constructor === ArrayBuffer;
}

export function isObject(arg) {
  return !!arg && typeof arg === 'object';
}

export function isDate(arg, notEmpty = false) {
  return arg instanceof Date && !isNaN(+arg) && (notEmpty ? +arg !== 0 : true);
}

export function isRegExp(arg) {
  return toString.call(arg) == '[object RegExp]';
}

export function isPromise(arg) {
  return !!arg && typeof arg.subscribe !== 'function' && typeof arg.then === 'function';
}


/*
 * Objects
 */

// Usage:
// defined(undefined, null, 0/0, 'first-valid', 123, 'foo') => 'first-valid'

export function defined(...args) {
  return args.reduce((a, b) => a || b);
}

/*
 * Arrays
 */


// Usage:
// compact([1,,undefined,null,NaN,5,3]) => [1,5,3]

export function compact(array) {
	if (!Array.isArray(array))
		return [];

	return array.filter(Boolean);
}


// Usage:
// uniq([1,2,1,2,2,1]) => [1,2]
// Note: if you need uniq of objects and/or uniqBy/uniqWith use Ramda instead (R.uniqWith(R.identical))

export function uniq(array) {
	return Array.from(new Set(array));
}

// Usage:
// cleanup([,,undefined,NaN,null,1,2]) => [1,2]

export function cleanup(array) {
	return uniq(compact(array));
}

// Usage:
// shuffle([1, 2, 3, 4]) => [3, 1, 4, 2] in random order

export function shuffle(array) {
  const len = array.length - 1;
  for (let index = len; index >= 0; --index) {
    let pivot = Math.round(Math.random() * len);
    [array[pivot], array[index]] =
    [array[index], array[pivot]];
  }
  return array;
}
