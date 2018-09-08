var sessionStorageMock = (function() {
  var store = {};

  return {
    getItem: jest.fn(key => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});
