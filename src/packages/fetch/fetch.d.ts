export interface IResponse {
  ok: boolean; // 200-299 status code range
  status: string;
  statusText: string;
  url: string;
  clone: IResponse;
  json: () => Promise<any>;
  headers: {
    keys: () => [string];
    entries: () => string[][]; // 2D matrix as [key, value]
    get: (header: string) => string;
    has: (header: string) => Boolean; // Check for existence of key argument in the keys of the headers object
  };
}

export interface IFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' | 'HEAD' | 'OPTIONS' | 'CONNECT';
  headers?: any;
  body?: any;
  credentials?: 'include' | undefined;
}

interface Window {
  fetch(url: string): Promise<IResponse>;
  fetch(url: string, options: IFetchOptions): Promise<IResponse>;
}
