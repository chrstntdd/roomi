type GenericObject = { [key: string]: any };

/**
 * @description To safely access a deeply nested field within an object.
 */
export default function pick(obj: GenericObject, keyPath: string, defaultValue?: any, p?: any) {
  p = 0;
  keyPath = keyPath.split ? keyPath.split('.') : keyPath;
  while (obj && p < keyPath.length) obj = obj[keyPath[p++]];
  return obj === undefined || p < keyPath.length ? defaultValue : obj;
}
