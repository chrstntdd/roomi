export const noop = () => {};

/**
 * @description
 * To conditionally join classnames
 *
 * @param arr An array of strings or expressions that evaluate to a string
 */
export const classNames = (arr: string[]): string => {
  let classes = [];

  for (let i = 0; i < arr.length; i++) {
    const arg = arr[i];
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      const inner = classNames.apply(null, arg);
      if (inner) classes.push(inner);
    }
  }

  return classes.join(' ');
};

/* STRING FORMATTING */
export const capitalizeFirstChar = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export async function sha256(input) {
  const inputBuf = new TextEncoder().encode(input);

  const hashBuf = await crypto.subtle.digest('SHA-256', inputBuf);

  const hashArr = Array.from(new Uint8Array(hashBuf));

  const hashHex = hashArr.map(h => ('00' + h.toString(16)).slice(-2)).join('');

  return hashHex;
}

export function throttle(delay: number, fn: Function) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
}
