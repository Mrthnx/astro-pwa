function getMawoisWithCollectDataStore() {
  const mawoisWithCollectDataStore = JSON.parse(
    localStorage.getItem("mawoisWithCollectData") || "[]",
  );
  return mawoisWithCollectDataStore;
}

function saveMawoisWithCollectDataStore(mawoisWithCollectDataStore) {
  localStorage.setItem(
    "mawoisWithCollectData",
    JSON.stringify(mawoisWithCollectDataStore),
  );
}

function getMawoiSelectedStore() {
  let mawoiSelectedStore = localStorage.getItem("mawoiSelected");
  if (!mawoiSelectedStore) {
    return null;
  }
  return JSON.parse(mawoiSelectedStore);
}

function saveMawoiSelectedStore(mawoiSelectedStore) {
  localStorage.setItem("mawoiSelected", JSON.stringify(mawoiSelectedStore));
}

function getVariablesStore() {
  const variablesStore = localStorage.getItem("setVariables");
  if (!variablesStore) {
    return null;
  }
  return JSON.parse(variablesStore);
}

function saveVariablesStore(variablesStore) {
  localStorage.setItem("setVariables", JSON.stringify(variablesStore));
}

function getAwaitTimeStore() {
  const awaitTimeStore = localStorage.getItem("awaitTime");
  if (!awaitTimeStore) {
    return null;
  }
  return JSON.parse(awaitTimeStore);
}

function saveAwaitTimeStore(awaitTimeStore) {
  localStorage.setItem("awaitTime", JSON.stringify(awaitTimeStore));
}

function getPlantsStore() {
  return JSON.parse(localStorage.getItem("plants") || "[]");
}

function savePlantsStore(plantsStore) {
  localStorage.setItem("plants", JSON.stringify(plantsStore));
}
