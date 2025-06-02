function fetchData(url, isJson) {
  console.log("fetchData", url);
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return isJson ? response.json() : response.text();
  });
}
