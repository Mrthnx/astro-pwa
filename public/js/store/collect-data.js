// Función para abrir la base de datos
function openDatabase() {
  console.log("Opening database...");
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("collectData", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("mawoisWithCollectData")) {
        db.createObjectStore("mawoisWithCollectData", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Función genérica para obtener el objectStore
async function getObjectStore(storeName, mode = "readonly") {
  const db = await openDatabase();
  const transaction = db.transaction(storeName, mode); // Inicia una transacción con el modo especificado
  return transaction.objectStore(storeName);
}

// Función para obtener datos del almacén "mawoisWithCollectData"
async function getMawoisWithCollectDataStore() {
  const store = await getObjectStore("mawoisWithCollectData", "readonly");
  return new Promise((resolve, reject) => {
    const request = store.get(1); // ID único para el registro

    request.onsuccess = (event) => {
      const result = event.target.result;
      if (result) {
        resolve(JSON.parse(result.data)); // Convertimos de JSON a un array
      } else {
        resolve([]); // Retornar un array vacío si no hay datos
      }
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Función para guardar datos en el almacén "mawoisWithCollectData"
async function saveMawoisWithCollectDataStore(mawoisWithCollectDataStore) {
  const store = await getObjectStore("mawoisWithCollectData", "readwrite");
  return new Promise((resolve, reject) => {
    const dataToStore = {
      id: 1, // ID único
      data: JSON.stringify(mawoisWithCollectDataStore), // Convertimos a JSON
    };

    const request = store.put(dataToStore);

    request.onsuccess = () => {
      resolve("Datos guardados exitosamente.");
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function getImageFromIndexedDB(id) {
  const store = await getObjectStore("images", "readonly");
  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = function (event) {
      if (event.target.result) {
        resolve(event.target.result.images); // Devuelve el Blob de la imagen
      } else {
        reject(`No image found for URL: ${id}`);
      }
    };

    request.onerror = function (event) {
      reject(`Error retrieving image: ${id} - ${event.target.errorCode}`);
    };
  });
}

async function saveImageToIndexedDB(id, images) {
  const store = await getObjectStore("images", "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.put({ id, images });

    request.onsuccess = function () {
      resolve(`Image saved successfully ${id}`);
    };

    request.onerror = function (event) {
      reject(`Error saving image: ${id} - ${event.target.errorCode}`);
    };
  });
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

function saveErrosMawois(mawoiId) {
  let errors = localStorage.getItem("errorsMawois") || "[]";
  errors = JSON.parse(errors);
  errors.push(mawoiId);
  localStorage.setItem("errorsMawois", JSON.stringify(errors));
}

function getErrorsMawois() {
  let errors = localStorage.getItem("errorsMawois") || "[]";
  return JSON.parse(errors);
}
