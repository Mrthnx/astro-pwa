function getSystemConfigStore() {
  const config = localStorage.getItem("systemConfig");
  if (!config) {
    return null;
  }
  return JSON.parse(config);
}

function saveSystemConfigStore(config) {
  localStorage.setItem("systemConfig", JSON.stringify(config));
}
