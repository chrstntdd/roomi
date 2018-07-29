import { IResponse, IFetchOptions } from './fetch.d';

/* CLONE/FORK OF https://github.com/developit/unfetch */

export default (typeof fetch === 'function'
  ? fetch.bind()
  : (url: string, options: IFetchOptions): Promise<IResponse> => {
      options = options || {};

      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open(options.method || 'get', url, true);

        for (let header in options.headers) {
          request.setRequestHeader(header, options.headers[header]);
        }

        request.withCredentials = options.credentials === 'include';

        request.onload = () => resolve(response());

        request.onerror = reject;

        request.send(options.body);

        const response = () => {
          let keys = [];
          let all = [];
          let headers = {};
          let header;

          request
            .getAllResponseHeaders()
            .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (_, key: string, value: string) => {
              keys.push((key = key.toLowerCase()));
              all.push([key, value]);
              header = headers[key];
              headers[key] = header ? `${header},${value}` : value;
            });

          return {
            ok: ((request.status / 100) | 0) === 2,
            status: request.status,
            statusText: request.statusText,
            url: request.responseURL,
            clone: response,
            json: () => Promise.resolve(request.responseText).then(JSON.parse),
            headers: {
              keys: () => keys,
              entries: () => all,
              get: key => headers[key.toLowerCase()],
              has: key => key.toLowerCase() in headers
            }
          };
        };
      });
    });
