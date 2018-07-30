import { task } from 'folktale/concurrency/task';

import { IResponse } from './fetch';
import fetch from './';

function checkForLocalJWT() {
  try {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) return jwt;
    else throw new Error('JWT not found');
  } catch (error) {
    return null;
  }
}

function checkStatus(response: IResponse): Promise<IResponse> {
  if (response.ok) return Promise.resolve(response);
  else {
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}

function getRequestBody(method, body?: any, withAuth?: boolean) {
  let jwt;
  jwt = withAuth ? { Authorization: checkForLocalJWT() } : {};
  body = body ? JSON.stringify(body) : {};
  return {
    method,
    credentials: 'include',
    headers: {
      ...jwt,
      'Content-Type': 'application/json'
    },
    body
  };
}

function get(url) {
  return task(async resolver => {
    try {
      const response = await fetch(url);

      await checkStatus(response);

      resolver.resolve(await response.json());
    } catch (error) {
      resolver.reject(error);
    }
  });
}

function put(url, payload, withAuth?: boolean) {
  return task(async resolver => {
    try {
      const response = await fetch(url, getRequestBody('put', payload, withAuth));

      await checkStatus(response);

      resolver.resolve(await response.json());
    } catch (error) {
      resolver.reject(error);
    }
  });
}

function post(url, payload, withAuth?: boolean) {
  return task(async resolver => {
    try {
      const response = await fetch(url, getRequestBody('post', payload, withAuth));

      await checkStatus(response);

      resolver.resolve(await response.json());
    } catch (error) {
      resolver.reject(error);
    }
  });
}

function del(url, payload, withAuth?: boolean) {
  return task(async resolver => {
    try {
      const response = await fetch(url, getRequestBody('delete', payload, withAuth));

      await checkStatus(response);

      resolver.resolve(await response.json());
    } catch (error) {
      resolver.reject(error);
    }
  });
}

export { get, put, post, del };
