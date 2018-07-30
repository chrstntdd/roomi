/**
 * @description To safely access a deeply nested field within an object.
 */
export default function diiv(
  obj: GenericObject,
  keyPath: string[] | string,
  defaultValue?: any
): any {
  let nestingLevel = 0;
  // @ts-ignore allow for an array `keyPath` or strings
  keyPath = keyPath.split ? keyPath.split('.') : keyPath;
  while (obj && nestingLevel < keyPath.length) obj = obj[keyPath[nestingLevel++]];
  return obj === undefined || nestingLevel < keyPath.length ? defaultValue : obj;
}
