function roundDecimals(val) {
  return Math.round(val * 1000) / 1000;
}

function peakToPeak(arr) {
  const valMaxY = Math.max(...arr);
  const valMinY = Math.min(...arr);
  return {
    pkTopk: roundDecimals(Math.abs(valMaxY) + Math.abs(valMinY)) || 0,
    max: roundDecimals(valMaxY) || 0,
    min: roundDecimals(valMinY) || 0,
  };
}

function crestFactor(arr) {
  const valMaxY = Math.max(...arr);
  const valMeanY = meanOverall(arr);
  let calc = arr.reduce(
    (sum, num) => sum + (valMeanY - num) * (valMeanY - num),
    0,
  );
  calc = calc / arr.length;
  calc = Math.sqrt(calc);
  return roundDecimals(valMaxY / calc) || 0;
}

function meanOverall(numeros) {
  const suma = numeros.reduce((acumulador, numero) => acumulador + numero, 0);
  return roundDecimals(suma / numeros.length);
}

function calculateOverall(arr) {
  const sumOfSquares = arr.reduce((sum, num) => sum + num ** 2, 0);
  const result = Math.sqrt(sumOfSquares);
  return roundDecimals(result);
}

function spectraVelocity(input) {
  const fixedMultiplier = 2000; // Ajusta este valor según tus necesidades
  const fullTurn = 360; // Ajusta este valor según tus necesidades

  // Convertir la entrada en un array de números
  const accelSAsMeasureY = input.map(Number).filter((x) => !isNaN(x));

  // Inicializar row_number
  let rowNumber = 0;

  // Aplicar la fórmula por primera vez
  const resultsOnce = accelSAsMeasureY.map((value) => {
    rowNumber += 1;
    return fixedMultiplier * (value / (fullTurn * rowNumber));
  });

  // Convertir los primeros 5 valores en 0
  for (let i = 0; i < 5; i++) {
    if (i < accelSAsMeasureY.length) {
      accelSAsMeasureY[i] = 0;
    }
    if (i < resultsOnce.length) {
      resultsOnce[i] = 0;
    }
  }

  // Convertir el resultado en una cadena separada por comas
  return resultsOnce;
}

function spectraDisplacement(input) {
  const fixedMultiplier = 2000; // Ajusta este valor según tus necesidades
  const fullTurn = 360; // Ajusta este valor según tus necesidades

  // Convertir la entrada en un array de números
  const accelSAsMeasureY = input.map(Number).filter((x) => !isNaN(x));

  // Aplicar la fórmula por primera vez
  let rowNumber = 0;
  const resultsOnce = accelSAsMeasureY.map((value) => {
    rowNumber += 1;
    return fixedMultiplier * (value / (fullTurn * rowNumber));
  });

  // Aplicar la fórmula por segunda vez
  rowNumber = 0;
  const resultsTwice = resultsOnce.map((value) => {
    rowNumber += 1;
    return fixedMultiplier * (value / (fullTurn * rowNumber));
  });

  // Convertir los primeros 5 valores en 0
  for (let i = 0; i < 5; i++) {
    if (i < resultsTwice.length) {
      resultsTwice[i] = 0;
    }
  }

  // Convertir el resultado en una cadena separada por comas
  return resultsTwice;
}

// Integración numérica usando el método del trapecio
function cumulativeTrapezoidalIntegration(data, dx) {
  const integral = [0];

  for (let i = 1; i < data.length; i++) {
    const trapezoidArea = ((data[i] + data[i - 1]) / 2) * dx;
    integral.push(integral[i - 1] + trapezoidArea);
  }

  return integral;
}

function waveformVelocity(input) {
  // Supongamos que tienes la data de aceleración en un array
  const acceleration = input.map(Number).filter((x) => !isNaN(x)); // Convertir la entrada en un array de números

  // Definir el número de repeticiones
  const numRepetitions = 1; // Puedes cambiar este valor según tus necesidades

  // Repetir los datos el número especificado de veces
  const accelerationSets = Array(numRepetitions).fill(acceleration);

  // Intervalo de tiempo entre muestras
  const dt = 0.01; // Intervalo de tiempo en segundos, ajusta según tus datos

  // Calcular la velocidad para cada conjunto de datos de aceleración
  const velocities = accelerationSets.map((accData) => {
    // Integración para obtener la velocidad
    let velocity = cumulativeTrapezoidalIntegration(accData, dt);

    // Centrar la velocidad en 0
    const meanVelocity =
      velocity.reduce((sum, val) => sum + val, 0) / velocity.length;
    velocity = velocity.map((v) => v - meanVelocity);

    return velocity;
  });

  // Convertir el resultado en una cadena separada por comas
  return velocities[0]; // Solo se imprime la primera repetición para simplificar
}

function waveformDisplacement(input) {
  // Convertir la entrada en un array de números
  const acceleration = input.map(Number).filter((x) => !isNaN(x));

  // Definir el número de repeticiones
  const numRepetitions = 1;

  // Repetir los datos el número especificado de veces
  const accelerationSets = Array(numRepetitions).fill(acceleration);

  // Intervalo de tiempo entre muestras
  const dt = 0.01; // Intervalo de tiempo en segundos

  // Calcular el desplazamiento para cada conjunto de datos de aceleración
  const displacements = accelerationSets.map((accData) => {
    // Integración para obtener la velocidad
    let velocity = cumulativeTrapezoidalIntegration(accData, dt);

    // Centrar la velocidad en 0
    const meanVelocity =
      velocity.reduce((sum, val) => sum + val, 0) / velocity.length;
    velocity = velocity.map((v) => v - meanVelocity);

    // Integración para obtener el desplazamiento
    const displacement = cumulativeTrapezoidalIntegration(velocity, dt);

    return displacement;
  });

  // Convertir el resultado en una cadena separada por comas
  return displacements[0]; // Imprimir solo la primera repetición
}
