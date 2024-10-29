function getBandsInfoStore() {
  const bandsInfoStore = JSON.parse(
    localStorage.getItem("bandsInfoStore") || "[]",
  );
  return bandsInfoStore;
}

function saveBandsInfoStore(bandsInfoStore) {
  localStorage.setItem("bandsInfoStore", JSON.stringify(bandsInfoStore));
}

function addBandsInfoToStore(bandsInfo) {
  const bandsInfoStore = getBandsInfoStore();
  bandsInfoStore.push(bandsInfo);
  saveBandsInfoStore(bandsInfoStore);
}

function getBandsInfoFromStore(idx) {
  const bandsInfoStore = getBandsInfoStore();
  return bandsInfoStore[idx];
}

function updateBandsInfoStore(idx, bandsInfo) {
  const bandsInfoStore = getBandsInfoStore();
  bandsInfoStore[idx] = { ...bandsInfoStore[idx], ...bandsInfo };
  saveBandsInfoStore(bandsInfoStore);
}

function searchBandInfoInStore(mawoiId, pointCode, date) {
  const bandsInfoStore = getBandsInfoStore();

  return bandsInfoStore.findIndex(
    (bandInfo) =>
      bandInfo.mawoiId == mawoiId &&
      bandInfo.pointCode == pointCode &&
      bandInfo.date < date,
  );
}

function getLastBandsInfoFromStore(chartName) {
  const _pointSelect = pointSelect.options[pointSelect.selectedIndex];

  const lastBandsIdx = searchBandInfoInStore(
    mawoiSelect.value,
    _pointSelect.text +
      (chartName.includes("_X") ? "X" : chartName.includes("_Y") ? "Y" : "Z"),
    dateSelect.value,
  );

  let lastBandsInfo = null;
  if (lastBandsIdx >= 0) {
    lastBandsInfo = getBandsInfoFromStore(lastBandsIdx);
  }
  return lastBandsInfo;
}
