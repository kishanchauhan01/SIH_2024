import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

window.HTMLFormElement.prototype.submit = () => {};
