/**
 * @description
 * Simple sha-256 implementation.
 *
 * At some point, if performance is critical, consider using node-forge's implementation:
 * ```
 * importScripts('https://unpkg.com/node-forge@0.7.0/dist/forge.min.js');
 *
 * const md = forge.md.sha256.create();
 * md.update(<SOME_VALUE/>);
 * const hash = md.digest().toHex();
 *
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
 */
async function sha256(input) {
  const inputBuf = new TextEncoder().encode(input);

  const hashBuf = await crypto.subtle.digest('SHA-256', inputBuf);

  const hashArr = Array.from(new Uint8Array(hashBuf));

  const hashHex = hashArr.map(h => ('00' + h.toString(16)).slice(-2)).join('');

  return hashHex;
}

self.addEventListener(
  'message',
  async function(e) {
    const hash = await sha256(e.data);
    self.postMessage({ type: 'HASHED_PASSWORD', hash });
  },
  false
);
