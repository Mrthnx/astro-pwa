// Importar las bibliotecas necesarias
const noble = require("@abandonware/noble");
const readline = require("readline-sync");
const EventEmitter = require("events");
const fs = require("fs");

// UUIDs de servicio y características (sin guiones y en minúsculas)
const SERVICE_UUID = "91bad492b9504226aa2b4ede9fa42f59";
const DATA_CHARACTERISTIC_UUID = "cba1d466344c4be3ab3f189f80dd7518";
const COMMAND_UUID = "19b10001e8f2537e4f6cd104768a1214";
const VARIABLE_UUID = "19b10002e8f2537e4f6cd104768a1214";

class BLEAccelerometerClient extends EventEmitter {
  constructor(deviceName = "ESP32_BLE") {
    super();
    this.deviceName = deviceName;
    this.peripheral = null;
    this.dataCharacteristic = null;
    this.commandCharacteristic = null;
    this.variableCharacteristic = null;
    this.receivingData = false;
    this.currentAxis = null;

    // Variables para almacenar datos
    this.timeDomainData = [];
    this.frequencyDomainData = [];

    // Estados para manejar la recepción de datos
    this.currentDataType = null; // 'time_domain' o 'frequency_domain'
    this.partialDataBuffer = Buffer.alloc(0); // Buffer para datos parciales

    // Variables del ESP32
    this.variables = {};

    // Datos por eje
    this.axisData = {
      X: { wav_acc: [], spec_acc: [] },
      Y: { wav_acc: [], spec_acc: [] },
      Z: { wav_acc: [], spec_acc: [] },
    };

    // Marcadores conocidos
    this.markers = [
      "END",
      "TIME_DOMAIN",
      "END_TIME_DOMAIN",
      "FREQUENCY_DOMAIN",
      "END_FREQUENCY_DOMAIN",
    ];
  }

  start() {
    noble.on("stateChange", (state) => {
      if (state === "poweredOn") {
        console.log("Bluetooth está encendido, comenzando a escanear...");
        noble.startScanning([], false); // Escanea todos los dispositivos
      } else {
        console.log("Bluetooth no está disponible.");
        noble.stopScanning();
      }
    });

    noble.on("scanStart", () => {
      console.log("Escaneo iniciado.");
    });

    noble.on("scanStop", () => {
      console.log("Escaneo detenido.");
    });

    noble.on("discover", async (peripheral) => {
      const localName = peripheral.advertisement.localName || "Sin nombre";
      console.log(
        `Dispositivo encontrado: ${localName} - UUID: ${peripheral.uuid}`,
      );

      // Filtrar por nombre de dispositivo
      if (localName === this.deviceName) {
        console.log(`Dispositivo ${this.deviceName} encontrado.`);
        noble.stopScanning();
        this.peripheral = peripheral;
        await this.connect();
      }
    });

    noble.on("error", (error) => {
      console.error("Error en noble:", error);
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.peripheral.connect((error) => {
        if (error) {
          console.error("Error al conectar:", error);
          reject(error);
          return;
        }
        console.log("Conectado al ESP32.");

        this.peripheral.discoverServices([SERVICE_UUID], (error, services) => {
          if (error) {
            console.error("Error al descubrir servicios:", error);
            reject(error);
            return;
          }

          const service = services[0];
          if (!service) {
            console.error("Servicio no encontrado.");
            reject(new Error("Servicio no encontrado"));
            return;
          }

          service.discoverCharacteristics([], (error, characteristics) => {
            if (error) {
              console.error("Error al descubrir características:", error);
              reject(error);
              return;
            }

            console.log("Características descubiertas:");
            characteristics.forEach((characteristic) => {
              const uuid = characteristic.uuid.toLowerCase(); // Asegurar minúsculas
              console.log(`- UUID: ${uuid}`);

              if (uuid === DATA_CHARACTERISTIC_UUID) {
                this.dataCharacteristic = characteristic;
              } else if (uuid === COMMAND_UUID) {
                this.commandCharacteristic = characteristic;
              } else if (uuid === VARIABLE_UUID) {
                this.variableCharacteristic = characteristic;
              }
            });

            // Verificar si todas las características necesarias están disponibles
            if (
              this.dataCharacteristic &&
              this.commandCharacteristic &&
              this.variableCharacteristic
            ) {
              console.log("Todas las características encontradas y listas.");
              this.emit("connected");
              resolve();
            } else {
              console.error(
                "No se encontraron todas las características necesarias.",
              );
              if (!this.dataCharacteristic)
                console.error("Falta dataCharacteristic.");
              if (!this.commandCharacteristic)
                console.error("Falta commandCharacteristic.");
              if (!this.variableCharacteristic)
                console.error("Falta variableCharacteristic.");
              reject(new Error("Características faltantes"));
            }
          });
        });

        this.peripheral.on("disconnect", () => {
          console.log("Desconectado del ESP32.");
          process.exit(0);
        });
      });
    });
  }

  async sendCommand(command) {
    if (this.commandCharacteristic) {
      console.log(`Enviando comando: ${command}`);
      const buffer = Buffer.from(command, "utf-8");
      await new Promise((resolve, reject) => {
        this.commandCharacteristic.write(buffer, false, (error) => {
          if (error) {
            console.error("Error al enviar comando:", error);
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } else {
      console.error("Característica de comando no disponible.");
    }
  }

  dataNotificationHandler(data) {
    // Intentar decodificar el mensaje como UTF-8
    let message;
    try {
      message = data.toString("utf-8");
    } catch (e) {
      message = null;
    }

    if (message && this.markers.includes(message)) {
      if (message === "TIME_DOMAIN") {
        console.log("Inicio de datos en el dominio del tiempo.");
        this.currentDataType = "time_domain";
        this.timeDomainData = [];
        this.partialDataBuffer = Buffer.alloc(0);
      } else if (message === "END_TIME_DOMAIN") {
        console.log("Fin de datos en el dominio del tiempo.");
        this.currentDataType = null;
        this.partialDataBuffer = Buffer.alloc(0);
      } else if (message === "FREQUENCY_DOMAIN") {
        console.log("Inicio de datos en el dominio de la frecuencia.");
        this.currentDataType = "frequency_domain";
        this.frequencyDomainData = [];
        this.partialDataBuffer = Buffer.alloc(0);
      } else if (message === "END_FREQUENCY_DOMAIN") {
        console.log("Fin de datos en el dominio de la frecuencia.");
        this.currentDataType = null;
        this.partialDataBuffer = Buffer.alloc(0);
        console.log(
          `Recepción de datos del eje ${this.currentAxis} completada.`,
        );
        this.receivingData = false;
        this.emit("dataReceived");
      }
    } else {
      // Asumir que son datos binarios
      if (
        this.currentDataType === "time_domain" ||
        this.currentDataType === "frequency_domain"
      ) {
        this.partialDataBuffer = Buffer.concat([this.partialDataBuffer, data]);

        // Desempaquetar los doubles cuando tengamos suficientes bytes
        while (this.partialDataBuffer.length >= 8) {
          const chunk = this.partialDataBuffer.slice(0, 8);
          this.partialDataBuffer = this.partialDataBuffer.slice(8);

          const value = chunk.readDoubleLE(0);

          if (this.currentDataType === "time_domain") {
            this.timeDomainData.push(value);
          } else if (this.currentDataType === "frequency_domain") {
            this.frequencyDomainData.push(value);
          }
        }
      } else {
        console.log("Datos binarios recibidos sin tipo específico. Ignorando.");
      }
    }
  }

  variableNotificationHandler(data) {
    const message = data.toString("utf-8");
    const variables = message.trim().split(";");
    variables.forEach((varStr) => {
      if (varStr) {
        const [key, value] = varStr.split("=");
        this.variables[key] = parseInt(value, 10);
      }
    });
    console.log("Variables recibidas del ESP32:");
    console.log(this.variables);
  }

  async getVariables() {
    if (this.variableCharacteristic) {
      this.variableCharacteristic.subscribe((error) => {
        if (error) {
          console.error("Error al suscribirse a variables:", error);
          return;
        }
        console.log("Suscrito a variables.");
      });

      this.variableCharacteristic.on(
        "data",
        this.variableNotificationHandler.bind(this),
      );

      await this.sendCommand("GET_VARIABLES");

      // Esperar un momento para recibir las variables
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.variableCharacteristic.unsubscribe((error) => {
        if (error) {
          console.error("Error al desuscribirse de variables:", error);
          return;
        }
        console.log("Desuscrito de variables.");
      });
    } else {
      console.error("Característica de variables no disponible.");
      throw new Error("Característica de variables no disponible.");
    }
  }

  async setVariable(variableName, value) {
    const command = `SET_${variableName.toUpperCase()}=${value}`;
    await this.sendCommand(command);
  }

  async requestDataForAxis(axisCommand) {
    if (!this.dataCharacteristic) {
      console.error("Característica de datos no disponible.");
      throw new Error("Característica de datos no disponible.");
    }

    // Determinar el eje actual basado en el comando
    if (axisCommand === "NEXT_X") {
      this.currentAxis = "X";
    } else if (axisCommand === "NEXT_Y") {
      this.currentAxis = "Y";
    } else if (axisCommand === "NEXT_Z") {
      this.currentAxis = "Z";
    } else {
      console.error("Comando desconocido.");
      return;
    }

    this.receivingData = true;

    this.dataCharacteristic.subscribe((error) => {
      if (error) {
        console.error("Error al suscribirse a datos:", error);
        return;
      }
      console.log("Suscrito a datos.");
    });

    this.dataCharacteristic.on("data", this.dataNotificationHandler.bind(this));

    await this.sendCommand(axisCommand);

    // Medir el tiempo de recepción
    const startTime = Date.now();

    // Esperar hasta que se reciban todos los datos
    await new Promise((resolve) => {
      this.once("dataReceived", () => {
        resolve();
      });
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.dataCharacteristic.unsubscribe((error) => {
      if (error) {
        console.error("Error al desuscribirse de datos:", error);
        return;
      }
      console.log("Desuscrito de datos.");
    });

    console.log(
      `\nDatos recibidos para el eje ${this.currentAxis} en ${duration.toFixed(2)} segundos.`,
    );
    console.log(
      `Cantidad de datos en el dominio del tiempo: ${this.timeDomainData.length}`,
    );
    console.log(
      `Cantidad de datos en el dominio de la frecuencia: ${this.frequencyDomainData.length}`,
    );

    // Almacenar los datos en la estructura correspondiente
    this.axisData[this.currentAxis]["wav_acc"] = [...this.timeDomainData];
    this.axisData[this.currentAxis]["spec_acc"] = [...this.frequencyDomainData];

    // Mostrar los primeros 10 datos
    console.log(
      `Primeros 10 datos en el dominio del tiempo del eje ${this.currentAxis}:`,
    );
    console.log(this.timeDomainData.slice(0, 10));

    console.log(
      `Primeros 10 datos en el dominio de la frecuencia del eje ${this.currentAxis}:`,
    );
    console.log(this.frequencyDomainData.slice(0, 10));
  }

  async requestDataAllAxes() {
    const totalStartTime = Date.now();

    await this.getVariables();

    for (const axisCommand of ["NEXT_X", "NEXT_Y", "NEXT_Z"]) {
      await this.requestDataForAxis(axisCommand);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const totalEndTime = Date.now();
    const totalDuration = (totalEndTime - totalStartTime) / 1000;
    console.log(
      `\nTiempo total de recepción para todos los ejes: ${totalDuration.toFixed(2)} segundos.`,
    );

    this.saveDataToJSON();
  }

  saveDataToJSON() {
    const data = {
      variables: this.variables,
      axes: this.axisData,
    };

    fs.writeFileSync("sensor_data.json", JSON.stringify(data, null, 4));
    console.log("Datos guardados en 'sensor_data.json'");
  }

  async run(userInput) {
    this.start();

    // Esperar hasta que la conexión y las características estén listas
    await new Promise((resolve, reject) => {
      this.once("connected", resolve);
      this.once("error", reject);
    });

    try {
      if (userInput.toLowerCase() === "exit") {
        console.log("Saliendo del programa.");
        this.peripheral.disconnect();
        process.exit(0);
      } else if (userInput.toLowerCase() === "collect x") {
        await this.requestDataForAxis("NEXT_X");
      } else if (userInput.toLowerCase() === "collect y") {
        await this.requestDataForAxis("NEXT_Y");
      } else if (userInput.toLowerCase() === "collect z") {
        await this.requestDataForAxis("NEXT_Z");
      } else if (userInput.toLowerCase() === "collect all") {
        await this.requestDataAllAxes();
      } else if (userInput.toLowerCase() === "get vars") {
        await this.getVariables();
      } else if (userInput.toLowerCase() === "set var") {
        const varName = readline
          .question(
            "Ingrese el nombre de la variable a modificar (SAMPLES, NLINES, RPM, FMAX, nRevs): ",
          )
          .trim();
        const value = readline
          .question(`Ingrese el nuevo valor para ${varName}: `)
          .trim();
        await this.setVariable(varName, value);
      } else {
        console.log("Comando no reconocido. Por favor, intente de nuevo.");
      }
    } catch (error) {
      console.error("Error al ejecutar el comando:", error.message);
    }
  }
}

// Crear una instancia del cliente y ejecutar
const client = new BLEAccelerometerClient();
client.run().catch((error) => {
  console.error("Error en el cliente BLE:", error);
});

