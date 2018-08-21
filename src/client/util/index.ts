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
