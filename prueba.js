function mostrarMatriz(matriz) {
  var container = document.getElementById("matriz-container");
  var table = document.createElement("table");

  for (var i = 0; i < matriz.length; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < matriz[i].length; j++) {
      var cell = document.createElement("td");
      cell.textContent = matriz[i][j];
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  container.appendChild(table);
}

// Ejemplo de uso
var matrizEjemplo = [
  [3],
  [2],
  [1]
];

