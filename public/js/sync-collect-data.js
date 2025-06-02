// Helper para calcular la diferencia en minutos entre dos fechas
function diffInMinutes(date1, date2) {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diffTime / (1000 * 60)); // Diferencia en minutos
}

// Función para agrupar los puntos según el rango de 15 minutos
function groupPointsByDate(mawois, rangeInMinutes = 15) {
  const result = [];

  mawois = mawois.filter(
    (mawoi, index, self) => index === self.findIndex((m) => m.id === mawoi.id),
  );

  mawois.forEach((mawoi) => {
    const groupedPoints = [];
    let currentGroup = [];

    // Ordenar los puntos por fecha
    const sortedPoints = mawoi.points
      .filter(
        (point, index, self) =>
          index ===
          self.findIndex((p) => p.id === point.id && p.date === point.date),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedPoints.forEach((point, index) => {
      if (currentGroup.length === 0) {
        currentGroup.push(point);
      } else {
        const lastPoint = currentGroup[currentGroup.length - 1];
        const minutesDiff = diffInMinutes(lastPoint.date, point.date);
        const pointExistsInGroup = currentGroup.some((p) => p.id === point.id);

        if (minutesDiff <= rangeInMinutes && !pointExistsInGroup) {
          // Si la diferencia es menor o igual a 15 minutos y el punto no existe en el grupo actual
          currentGroup.push(point);
        } else {
          // Si no, agrupa los puntos actuales y comienza un nuevo grupo
          groupedPoints.push([...currentGroup]);
          currentGroup = [point];
        }
      }

      // Si es el último punto, agrega el grupo actual a los grupos
      if (index === sortedPoints.length - 1) {
        groupedPoints.push([...currentGroup]);
      }
    });

    // Crear el nuevo objeto con el description e id del mawoi y el array de puntos agrupados
    result.push({
      id: mawoi.id,
      description: mawoi.description,
      groupedPoints: groupedPoints,
    });
  });

  return result;
}
