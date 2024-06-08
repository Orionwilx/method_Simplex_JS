let tablaprueba;
let objetivoFuncion;
let cantidadVariables;
let cantidadRestricciones;
function refreshPage() {
  location.reload();
}
function validarPrimerosValores() {
  var cantidadVariablesInput = document.getElementById("cantidadVariables");
  var cantidadRestriccionesInput = document.getElementById(
    "cantidadRestricciones"
  );
  var editElement = document.getElementById("edit");

  var cantidadVariables = parseInt(cantidadVariablesInput.value);
  var cantidadRestricciones = parseInt(cantidadRestriccionesInput.value);

  if (
    cantidadVariablesInput.value === "" ||
    cantidadRestriccionesInput.value === ""
  ) {
    editElement.textContent = "Los campos no pueden estar vacíos";
    return;
  }

  if (cantidadVariables < 2) {
    editElement.textContent =
      "La cantidad de variables debe ser mayor o igual a 2";
    return;
  }

  if (cantidadRestricciones < 1) {
    editElement.textContent =
      "La cantidad de restricciones debe ser mayor o igual a 1";
    return;
  }

  if (!Number.isInteger(cantidadVariables)) {
    editElement.textContent =
      "La cantidad de variables debe ser un número entero";
    return;
  }

  if (!Number.isInteger(cantidadRestricciones)) {
    editElement.textContent =
      "La cantidad de restricciones debe ser un número entero";
    return;
  }
  editElement.textContent = "";
  obtenerPrimerosValores();
}

function obtenerPrimerosValores() {
  var radioButtons = document.getElementsByName("op");
  var valorSeleccionado = "";
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      valorSeleccionado = radioButtons[i].value;
      break;
    }
  }

  // Ahora, "valorSeleccionado" contendrá el valor del radio button seleccionado
  console.log("El valor seleccionado es: " + valorSeleccionado);

  objetivoFuncion = valorSeleccionado;
  cantidadVariables = document.getElementById("cantidadVariables").value;
  cantidadRestricciones = document.getElementById(
    "cantidadRestricciones"
  ).value;

  crearElementosRestricciones(cantidadVariables, cantidadRestricciones);
  crearElementosFuncion(cantidadVariables, cantidadRestricciones);

  document.getElementById("first").style.display = "none";
  document.getElementById("funcTittle").style.display = "flex";
  document.getElementById("restTittle").style.display = "flex";
  document.getElementById("resolver").style.display = "flex";
}

function validarEntradas() {
  var datosFuncion = document.getElementsByClassName("datosFuncion");
  var inputrestricciones =
    document.getElementsByClassName("inputrestricciones");
  var editElement = document.getElementById("edit2");
  var datoRegex = /^[-]?[\d]+(?:\.[\d]+)?(?:\/[\d]+(?:\.[\d]+)?)?$/;

  for (var i = 0; i < datosFuncion.length; i++) {
    var valor = datosFuncion[i].value.trim();
    if (valor === "") {
      editElement.textContent =
        "La casilla " + (i + 1) + " de la función no puede estar vacía.";
      return false;
    }

    if (!datoRegex.test(valor)) {
      editElement.textContent =
        "La casilla " +
        (i + 1) +
        " de la función tiene un formato incorrecto. Por favor, ingresa un número válido.";
      return false;
    }
  }

  for (var i = 0; i < inputrestricciones.length; i++) {
    var valor = inputrestricciones[i].value.trim();
    if (valor === "") {
      editElement.textContent =
        "La casilla " + (i + 1) + " de las restricciones no puede estar vacía.";
      return false;
    }

    if (!datoRegex.test(valor)) {
      editElement.textContent =
        "La casilla " +
        (i + 1) +
        " de las restricciones tiene un formato incorrecto. Por favor, ingresa un número válido.";
      return false;
    }
  }

  ocultarIngresoDatos();
  ejecucion();

  return true;
}

function crearElementosFuncion(cantidadVariables) {
  var contenedor = document.getElementById("funcion");
  var funcionDiv = document.createElement("div");

  for (var j = 0; j < cantidadVariables; j++) {
    var input = document.createElement("input");
    input.type = "text";
    input.classList.add("datosFuncion");

    var variable = document.createElement("span");
    variable.textContent = "X";
    var subindice = document.createElement("sub");
    subindice.textContent = j + 1;
    variable.appendChild(subindice);

    funcionDiv.appendChild(input);
    funcionDiv.appendChild(variable);

    if (j !== cantidadVariables - 1) {
      var textoMas = document.createTextNode(" + ");
      funcionDiv.appendChild(textoMas);
    }
  }

  contenedor.appendChild(funcionDiv);
}

function crearElementosRestricciones(cantidadVariables, cantidadRestricciones) {
  var contenedor = document.getElementById("restricciones");

  for (var i = 0; i < cantidadRestricciones; i++) {
    var restriccionDiv = document.createElement("div");

    for (var j = 0; j < cantidadVariables; j++) {
      var input = document.createElement("input");
      input.type = "text";
      input.classList.add("inputrestricciones");

      var variable = document.createElement("span");
      variable.textContent = "X";
      var subindice = document.createElement("sub");
      subindice.textContent = j + 1;
      variable.appendChild(subindice);

      restriccionDiv.appendChild(input);
      restriccionDiv.appendChild(variable);

      if (j !== cantidadVariables - 1) {
        var textoMas = document.createTextNode(" +");
        restriccionDiv.appendChild(textoMas);
      }
    }

    var select = document.createElement("select");
    select.classList.add("igualdad");

    var opciones = ["≤", "≥", "="];
    for (var k = 0; k < opciones.length; k++) {
      var opcion = document.createElement("option");
      opcion.value = opciones[k];
      opcion.text = opciones[k];
      select.appendChild(opcion);
    }

    var resultadoInput = document.createElement("input");
    resultadoInput.type = "text";
    resultadoInput.classList.add("inputrestricciones");

    restriccionDiv.appendChild(select);
    restriccionDiv.appendChild(resultadoInput);

    contenedor.appendChild(restriccionDiv);
  }

  let string = "";
  for (let i = 1; i <= cantidadVariables; i++) {
    string += "x" + i + ",";
  }

  string = string.slice(0, -1);
  var condicionbase = document.createElement("p");
  condicionbase.classList.add("condicionbase");
  condicionbase.textContent = string + " ≥ 0";
  contenedor.appendChild(condicionbase);
}

function obtenerDatosFuncion() {
  var funcionObjetivoVanilla = "";
  var inputs = document.getElementsByClassName("datosFuncion");

  for (var i = 0; i < inputs.length; i++) {
    var valor = inputs[i].value.trim();
    var variable = "x(" + (i + 1) + ")";

    if (valor !== "") {
      if (valor.includes("/")) {
        var fraccion = math.fraction(valor);
        valor = math.format(fraccion);

        if (fraccion.d === 1) {
          if (fraccion.s === -1) {
            valor = "-" + fraccion.n.toString();
          } else {
            valor = fraccion.n.toString();
          }
        }
      } else if (valor.includes(".")) {
        valor = math.format(math.fraction(parseFloat(valor)));
      } else {
        valor = parseFloat(valor);
        valor = Number.isInteger(valor)
          ? valor.toString()
          : math.fraction(valor).toString();
      }

      if (parseFloat(valor) >= 0 && funcionObjetivoVanilla !== "") {
        funcionObjetivoVanilla += "+";
      }

      funcionObjetivoVanilla += valor + variable;
    }
  }

  return funcionObjetivoVanilla;
}

function obtenerDatosRestricciones() {
  var restriccionesDivs = document.querySelectorAll("#restricciones > div");
  var restricciones = [];

  for (var i = 0; i < restriccionesDivs.length; i++) {
    var restriccionDiv = restriccionesDivs[i];
    var inputs = restriccionDiv.querySelectorAll(".inputrestricciones");
    var igualdadSelect = restriccionDiv.querySelector(".igualdad");
    var resultadoInput = restriccionDiv.querySelector(
      'input[type="text"].inputrestricciones:last-of-type'
    );

    var restriccion = "";
    for (var j = 0; j < inputs.length - 1; j++) {
      var coeficiente = inputs[j].value;
      if (j !== 0 && coeficiente !== "" && parseFloat(coeficiente) !== 0) {
        restriccion += "+";
      }

      if (coeficiente !== "") {
        if (coeficiente.includes("/")) {
          var fraccion = math.fraction(coeficiente);
          coeficiente = math.format(fraccion);

          if (fraccion.d === 1) {
            if (fraccion.s === -1) {
              coeficiente = "-" + fraccion.n.toString();
            } else {
              coeficiente = fraccion.n.toString();
            }
          }
        } else if (coeficiente.includes(".")) {
          coeficiente = math.format(math.fraction(parseFloat(coeficiente)));
        } else {
          coeficiente = parseFloat(coeficiente);
          coeficiente = Number.isInteger(coeficiente)
            ? coeficiente.toString()
            : math.fraction(coeficiente).toString();
        }
      }

      restriccion += coeficiente + "x(" + (j + 1) + ")";
    }

    var igualdad = igualdadSelect.value;
    if (igualdad === "≥") {
      igualdad = ">=";
    } else if (igualdad === "≤") {
      igualdad = "<=";
    }

    if (resultadoInput.value !== "") {
      var resultado = resultadoInput.value;
      if (resultado.includes("/")) {
        var fraccionResultado = math.fraction(resultado);
        resultado = math.format(fraccionResultado);

        if (fraccionResultado.d === 1) {
          if (fraccionResultado.s === -1) {
            resultado = "-" + fraccionResultado.n.toString();
          } else {
            resultado = fraccionResultado.n.toString();
          }
        }
      } else if (resultado.includes(".")) {
        resultado = math.format(math.fraction(parseFloat(resultado)));
      } else {
        resultado = parseFloat(resultado);
        resultado = Number.isInteger(resultado)
          ? resultado.toString()
          : math.fraction(resultado).toString();
      }

      restriccion += igualdad + resultado;
    }

    restriccion = restriccion.replace("+-", "-");
    restricciones.push(restriccion);
  }

  return restricciones;
}

function ocultarIngresoDatos() {
  document.getElementById("funcion").style.display = "none";
  document.getElementById("restricciones").style.display = "none";
  document.getElementById("resolver").style.display = "none";
  document.getElementById("solucionDirecta").style.display = "none";
  document.getElementById("iterar").style.display = "block";
}

function mostrarMatrizA(matriz) {
  var container = document.getElementById("matriz-container");
  var table = document.createElement("table");
  var msg = document.getElementById("msgMatrizA");
  msg.innerHTML = "B<sup>-1</sup>A";
  msg.style.textAlign = "center";
  for (var i = 0; i < matriz.length; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < matriz[i].length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = matriz[i][j];
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
  // container.appendChild(msg);
  container.appendChild(table);
}

function mostrarMatrizB(matrizB) {
  var container = document.getElementById("MatrizB");
  var table = document.createElement("table");
  var msg = document.createElement("h5");
  msg.innerHTML = "B";
  msg.style.textAlign = "center";
  for (var i = 0; i < matrizB.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < matrizB[i].length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = matrizB[i][j];
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}

function redondearATresDecimales(numero) {
  return Math.round(numero * 1000) / 1000;
}

function mostrarMatrizBinv(matrizBinv) {
  var container = document.getElementById("MatrizBinv");
  var table = document.createElement("table");
  var msg = document.createElement("h5");
  msg.innerHTML = "B<sup>-1</sup>";
  msg.style.textAlign = "center";
  for (var i = 0; i < matrizBinv.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < matrizBinv[i].length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = redondearATresDecimales(matrizBinv[i][j]);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}
function mostrarVectorX(vectorX) {
  var container = document.getElementById("msgvectorx");
  var table = document.createElement("table");

  for (var i = 0; i < vectorX.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.innerHTML = vectorX[i].replace("(", "<sub>").replace(")", "</sub>");
    row.appendChild(cell);
    table.appendChild(row);
  }

  container.appendChild(table);
}

function mostrarListaHorizontalVectorX(lista) {
  var listaCopia = lista.slice(); // Copiar la lista original a una nueva matriz

  var container = document.getElementById("vectorX");
  var table = document.createElement("table");
  var row = document.createElement("tr");

  // Agregar elementos "x", "b" y "c" antes de la lista copiada
  for (var i = 0; i < listaCopia.length; i++) {
    var cell = document.createElement("td");
    cell.innerHTML = listaCopia[i].replace("(", "<sub>").replace(")", "</sub>");
    row.appendChild(cell);
  }

  table.appendChild(row);
  tablaprueba = table;
  container.appendChild(table);
}

function mostrarListaHorizontalVectorC(lista) {
  var listaCopia = lista.slice(); // Copiar la lista original a una nueva matriz

  var container = document.getElementById("vectorC");
  var table = document.createElement("table");
  var row = document.createElement("tr");

  // Agregar elementos "x", "b" y "c" antes de la lista copiada
  listaCopia.unshift(" ", " ", " ");
  listaCopia.push(" ");
  for (var i = 0; i < listaCopia.length; i++) {
    var cell = document.createElement("td");
    cell.textContent = listaCopia[i];
    row.appendChild(cell);
  }

  table.appendChild(row);
  container.appendChild(table);
}

function mostrarListaHorizontalVectorR(resultado6, lista) {
  var listaCopia = lista.slice(); // Copiar la lista original a una nueva matriz

  var container = document.getElementById("vectorR");
  var table = document.createElement("table");
  var row = document.createElement("tr");

  // Agregar elementos "x", "b" y "c" antes de la lista copiada
  listaCopia.unshift("Z: ", math.round(resultado6, 3), " R ");
  listaCopia.push(" ");
  for (var i = 0; i < listaCopia.length; i++) {
    var cell = document.createElement("td");
    cell.textContent = listaCopia[i];
    row.appendChild(cell);
  }

  table.appendChild(row);
  container.appendChild(table);
}

function mostrarListaVerticalVectorRestricciones(lista) {
  var container = document.getElementById("msgrestricciones");
  var table = document.createElement("table");

  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < lista[i].length; j++) {
      var cell = document.createElement("td");
      cell.textContent = lista[i][j];
      row.appendChild(cell);
      table.appendChild(row);
    }
  }

  container.appendChild(table);
}

function mostrarFuncionCompleta(lista) {
  var msg = document.getElementById("msgfuncionobjetivo");
  cell = document.createElement("h5");
  cell.innerHTML = lista.replaceAll("(", "<sub>").replaceAll(")", "</sub>");
  msg.appendChild(cell);
}

function mostrarListaVerticalVectorCb(lista) {
  var container = document.getElementById("vectorCb");
  var table = document.createElement("table");
  var msg = document.createElement("h5");
  msg.innerHTML = "C<sub>b</sub>";
  msg.style.textAlign = "center";
  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = lista[i];
    row.appendChild(cell);
    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}

function mostrarListaVerticalVectorB(lista) {
  var container = document.getElementById("vectorB");
  var table = document.createElement("table");
  var msg = document.createElement("h5");
  msg.innerHTML = "B<sup>-1</sup>b";
  msg.style.textAlign = "center";
  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = lista[i];
    row.appendChild(cell);
    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}
function mostrarVectorB(lista) {
  var container = document.getElementById("msgvectorb");
  var table = document.createElement("table");
  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = lista[i];
    row.appendChild(cell);
    table.appendChild(row);
  }

  container.appendChild(table);
}
function mostrarVectorC(lista) {
  var container = document.getElementById("msgvectorc");

  var table = document.createElement("table");

  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = lista[i];
    row.appendChild(cell);
    table.appendChild(row);
  }

  container.appendChild(table);
}
function mostrarListaVerticalVectorXb(lista) {
  var container = document.getElementById("vectorXb");
  var table = document.createElement("table");
  var msg = document.createElement("h5");
  msg.innerHTML = "X<sub>b</sub>";
  msg.style.textAlign = "center";
  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.innerHTML = lista[i].replace("(", "<sub>").replace(")", "</sub>");
    row.appendChild(cell);
    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}

function mostrarListaVerticalVectorO(lista) {
  var container = document.getElementById("vectorO");
  var msg = document.createElement("h5");
  msg.innerHTML = "Vector θ";
  var table = document.createElement("table");
  var row2 = document.createElement("tr");
  table.appendChild(row2);
  for (var i = 0; i < lista.length; i++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = lista[i];
    row.appendChild(cell);
    table.appendChild(row);
  }
  container.appendChild(msg);
  container.appendChild(table);
}

function borrarElementos() {
  var divs = [
    "vectorC",
    "vectorX",
    "vectorCb",
    "vectorXb",
    "vectorB",
    "matriz-container",
    "vectorO",
    "vectorR",
    "MatrizB",
    "MatrizBinv",
  ];

  for (var i = 0; i < divs.length; i++) {
    var div = document.getElementById(divs[i]);

    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }
}
