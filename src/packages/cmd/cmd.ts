import 'isomorphic-unfetch';
import { task } from 'folktale/concurrency/task';

function checkStatus(response) {
  if (response.ok) return Promise.resolve(response);
  else {
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}

function getRequestBody(method, body?: any, withAuth?: boolean) {
  const token = withAuth && sessionStorage.getItem('jwt');

  return {
    method,
    credentials: 'include',
    headers: {
      ...(token && withAuth ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    },
    ...(body ? { body: JSON.stringify(body) } : {})
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
