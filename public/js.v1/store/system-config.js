function getSystemConfigStore() {
  const config = localStorage.getItem("systemConfig");
  if (!config) {
    return {
      amplitude: 2,
      acc_type: 2,
      vel_type: 2,
      dis_type: 2,
      frequency: 2,
    };
  }
  return JSON.parse(config);
}

function saveSystemConfigStore(config) {
  localStorage.setItem("systemConfig", JSON.stringify(config));
}
