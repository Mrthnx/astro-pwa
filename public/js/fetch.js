function fetchData(url, isJson) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return isJson ? response.json() : response.text();
  });
}
