

function convertir_desigualdades_en_igualdades(d) {
    let igualdades = [];
    let variables = [];
  
    for (let i = 0; i < d.length; i++) {
      let desigualdad = d[i];
  
      if (desigualdad.includes("<=")) {
        igualdades.push(desigualdad.replace("<=", "+s(" + (i + 1) + ")="));
        variables.push("s(" + (i + 1) + ")");
      } else if (desigualdad.includes("<")) {
        igualdades.push(desigualdad.replace("<", "+s(" + (i + 1) + ")="));
        variables.push("s(" + (i + 1) + ")");
      } else if (desigualdad.includes(">=")) {
        igualdades.push(desigualdad.replace(">=", "-s(" + (i + 1) + ")+m(" + (i + 1) + ")="));
        variables.push("-s(" + (i + 1) + ")");
        variables.push("m(" + (i + 1) + ")");
      } else if (desigualdad.includes(">")) {
        igualdades.push(desigualdad.replace(">", "-s(" + (i + 1) + ")+m(" + (i + 1) + ")="));
        variables.push("-s(" + (i + 1) + ")");
        variables.push("m(" + (i + 1) + ")");
      } else if (desigualdad.includes("=")) {
        igualdades.push(desigualdad.replace("=", "+m(" + (i + 1) + ")="));
        variables.push("m(" + (i + 1) + ")");
      }
    }
  
    return [igualdades, variables];
    }
  
function agregar_variables_func_obj(func_objetivo, variables) {

  const numeros = func_objetivo.match(/\d+/g);  

  let numeroMasGrande = null;
  for (let i = 0; i < numeros.length; i++) {
    const numero = parseInt(numeros[i], 10);

    if (numeroMasGrande === null || numero > numeroMasGrande) {
      numeroMasGrande = numero;
    }
  }
  let nueva_func_objetivo = func_objetivo.replace(/(?<!\d)(x\(\d+\))(?! *\*)/g, '1$1');
  nueva_func_objetivo = nueva_func_objetivo.replace(/(\-?\d*)x\((\d+)\)/g, (match, p1, p2) => (p1 ? p1 : '1') + 'x(' + p2 + ')');
  
  

  const variables_x = variables.filter((varName) => varName.includes('x(')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });
  const variables_s = variables.filter((varName) => varName.includes('s(')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });
  const variables_m = variables.filter((varName) => varName.includes('m(')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

  for (let variable of variables_x) {
    nueva_func_objetivo += '+1' + variable;
  }

  for (let variable of variables_s) {
    if (variable.includes('-')) {
      nueva_func_objetivo += '-0' + variable.slice(1);
    } else {
      nueva_func_objetivo += '+0' + variable;
    }
  }

  const miu=(numeroMasGrande*10).toString()
  for (let variable of variables_m) {
    nueva_func_objetivo += "-"+miu + variable;
  }

  return nueva_func_objetivo;
    }

function crearVectorX(func_objetivo) {
  const variables = func_objetivo.match(/[a-zA-Z]+\(\d+\)/g);
  const posiciones = {};
  variables.forEach((variable, i) => {
    posiciones[variable] = i;
  });
  const variablesOrdenadas = variables.sort((a, b) => posiciones[a] - posiciones[b]);
  const vectorX = variablesOrdenadas.map((variable) => variable.match(/[a-zA-Z]+\(\d+\)/)[0]);
  return vectorX;
    }

function crearVectorC(func_objetivo) {
  const coeficientes = func_objetivo.match(/-?\d+\/?\d*\.?\d*[a-z]/g);
  const vectorC = coeficientes.map((c) => {
    const coeficiente = c.match(/-?\d+\/?\d*\.?\d*/)[0];
    return coeficiente;
  });
  return vectorC;
    }

function crearVectorB(restriccionesIgualdad) {
  const valores = restriccionesIgualdad.map((restriccion) => {
    const valor = restriccion.split('=')[1].trim();
    return valor;
  });
  const vectorB = valores;
  return vectorB;
    }

function CambiarFuncionMaximizacion(funcionObjetivo) {
// Agrega un signo "-" al comienzo del string
if (funcionObjetivo[0] !== '+' && funcionObjetivo[0] !== '-') {
    funcionObjetivo = '+' + funcionObjetivo;
}

// Reemplaza "+" por "-"
funcionObjetivo = funcionObjetivo.replace(/\+/g, '#');
// Reemplaza "-" por "+"
funcionObjetivo = funcionObjetivo.replace(/-/g, '+');
// Reemplaza "#" por "-"
funcionObjetivo = funcionObjetivo.replace(/#/g, '-');

return funcionObjetivo;
    }

function crearMatrizA(restricciones, variables) {
    function crearRestriccionesSinB(restricciones) {
      var restriccionesSinB = [];
      for (var i = 0; i < restricciones.length; i++) {
        var restriccion = restricciones[i];
        var restriccionSinB = restriccion.split("=")[0];
        restriccionesSinB.push(restriccionSinB);
      }
      return restriccionesSinB;
    }
  
    function crearRestriccionesCompletas(restriccionesSinB, variables) {
      var nuevas_restricciones = [];
      for (var i = 0; i < restriccionesSinB.length; i++) {
        var restriccion = restriccionesSinB[i];
        var nueva_restriccion = restriccion;
        for (var j = 0; j < variables.length; j++) {
          var variable = variables[j];
          if (!restriccion.includes(variable)) {
            nueva_restriccion += '+0' + variable;
          } else if (restriccion.indexOf(variable) === restriccion.indexOf(variable + '1')) {
            nueva_restriccion = nueva_restriccion.replace(variable, '1' + variable);
          }
        }
        nuevas_restricciones.push(nueva_restriccion);
      }
      return nuevas_restricciones;
    }
  
    function crearRestriccionesExplicitas(restriccionesCompletas, variables) {
      var restriccionesExplicitas = [];
      for (var i = 0; i < restriccionesCompletas.length; i++) {
        var restriccion = restriccionesCompletas[i];
        var regex = new RegExp('(?<!\\d)[a-z]+\\(\\d+\\)', 'g');
        var variablesEncontradas = restriccion.match(regex);
        if (variablesEncontradas) {
          for (var j = 0; j < variablesEncontradas.length; j++) {
            var variable = variablesEncontradas[j];
            var regexCoef = new RegExp(`(?<!\\d)-?\\d*\\.?\\d+?${variable}`, 'g');
            var coefEncontrado = restriccion.match(regexCoef);
            if (!coefEncontrado) {
              restriccion = restriccion.replace(variable, '1' + variable);
            }
          }
        }
        restriccionesExplicitas.push(restriccion);
      }
      return restriccionesExplicitas;
    }
  
    function crearRestriccionesOrdenadas(restriccionesExplicitas, variables) {
      var variable_posiciones = {};
      for (var i = 0; i < variables.length; i++) {
        var variable = variables[i];
        var variableEncontrada = variable.match(/[a-z]\(\d+\)/);
        variable_posiciones[variableEncontrada[0]] = i;
      }
  
      var restriccionesOrdenadas = [];
      for (var j = 0; j < restriccionesExplicitas.length; j++) {
        var restriccion = restriccionesExplicitas[j];
        var terminos_restriccion = restriccion.match(/-?\d*\/?\d*[a-z]\(\d+\)|-[a-z]\(\d+\)/g);
        var terminos_ordenados = terminos_restriccion.sort(function(a, b) {
          var variable_a = a.match(/[a-z]\(\d+\)/)[0];
          var variable_b = b.match(/[a-z]\(\d+\)/)[0];
          return variable_posiciones[variable_a] - variable_posiciones[variable_b];
        });
        var restriccion_ordenada = '';
        for (var k = 0; k < terminos_ordenados.length; k++) {
          var termino = terminos_ordenados[k];
          if (k > 0) {
            if (termino[0] !== '-' && termino[0] !== '+') {
              restriccion_ordenada += '+';
            }
          } else if (termino[0] !== '-' && termino[0] !== '+') {
            restriccion_ordenada += '+';
          }
          restriccion_ordenada += termino;
        }
        restriccionesOrdenadas.push(restriccion_ordenada);
      }
      return restriccionesOrdenadas;
    }
  
    function guardarCoeficientes(restricciones) {
      var restriccionCoeficientes = [];
      for (var i = 0; i < restricciones.length; i++) {
        var restriccion = restricciones[i];
        var numeros = restriccion.match(/-?\d*\/?\d+(?![^(]*\))/g);
        restriccionCoeficientes.push(numeros);
      }
      return restriccionCoeficientes;
    }
  
    function formarMatriz(restriccionesCoeficientes, variables) {
      const matrizA = math.reshape(restriccionesCoeficientes, [restriccionesCoeficientes.length, variables.length]);
      return matrizA;
    }
  
    var restriccionesSinB = crearRestriccionesSinB(restricciones);
    var restriccionesCompletas = crearRestriccionesCompletas(restriccionesSinB, variables);
    var restriccionesExplicitas = crearRestriccionesExplicitas(restriccionesCompletas, variables);
    var restriccionesOrdenadas = crearRestriccionesOrdenadas(restriccionesExplicitas, variables);
    var restriccionesCoeficientes = guardarCoeficientes(restriccionesOrdenadas);
    var matrizCreada = formarMatriz(restriccionesCoeficientes, variables);
  
    return matrizCreada;
    }
  
function identificarColumnasIdentidad(matriz) {
    const columnasIdentidad = [];
  
    for (let j = 0; j < matriz[0].length; j++) {
      let contadorUno = 0;
      let contadorCero = 0;
  
      for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][j] === '1') {
          contadorUno++;
        } else if (matriz[i][j] === '0') {
          contadorCero++;
        } else {
          contadorUno = 0;
          contadorCero = 0;
          break; 
        }
      }

      if (contadorUno === 1 && contadorCero === matriz.length - 1) {
        columnasIdentidad.push(j);
      }
    }
  
    return columnasIdentidad;
  }

function crearMatrizB(matrizOriginal, columnasIdentidad) {
    const matrizResultado = matrizOriginal.map((fila) => {
      return fila.filter((valor, indice) => columnasIdentidad.includes(indice));
    });  
    return matrizResultado;
  }
  
function crearVectoresMatrizB(vectorX, vectorC, columnasIdentidad) {
  const vectorXb = [];
  const vectorCb = [];
  
  for (let i = 0; i < columnasIdentidad.length; i++) {
      const indice = columnasIdentidad[i];
      vectorXb.push(vectorX[indice]);
      vectorCb.push(vectorC[indice]);
  }
  
  return {
      vectorXb,
      vectorCb
  };
  }

function convertirAFloatMatrizA(matrizOriginal) {
  var matrizAFloat = [];
  for (var i = 0; i < matrizOriginal.length; i++) {
    matrizAFloat[i] = convertirVectorANumericos(matrizOriginal[i]);
  }
  return matrizAFloat;
  }

function identificarColumnasIdentidad(matriz) {
    const columnasIdentidad = [];
  
    for (let j = 0; j < matriz[0].length; j++) {
      let contadorUno = 0;
      let contadorCero = 0;
  
      for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][j] === '1') {
          contadorUno++;
        } else if (matriz[i][j] === '0') {
          contadorCero++;
        } else {
          contadorUno = 0;
          contadorCero = 0;
          break; 
        }
      }

      if (contadorUno === 1 && contadorCero === matriz.length - 1) {
        columnasIdentidad.push(j);
      }
    }
  
    return columnasIdentidad;
  }

function crearMatrizB(matrizOriginal, columnasIdentidad) {
  // Crear copia independiente de matrizOriginal para matrizAEnteros
  var matrizAnum = matrizOriginal.map(function(fila) {
    return fila.slice(); // Crear copia de cada fila
  });

  const matrizResultado = matrizAnum.map(function(fila) {
    return fila.filter(function(valor, indice) {
      return columnasIdentidad.includes(indice);
    });
  });
  return matrizResultado;
  }

function crearVectoresMatrizB(vectorX, vectorC, columnasIdentidad) {
const vectorXb = [];
const vectorCb = [];

for (let i = 0; i < columnasIdentidad.length; i++) {
    const indice = columnasIdentidad[i];
    vectorXb.push(vectorX[indice]);
    vectorCb.push(vectorC[indice]);
}

return {
    vectorXb,
    vectorCb
};
  }

function convertirVectorANumericos(vector) {
  var nuevoVector = [];
  for (var i = 0; i < vector.length; i++) {
    var valor = vector[i];
    if (!isNaN(parseFloat(valor)) && isFinite(valor)) {
      nuevoVector.push(parseFloat(valor));
    } else if (valor.includes("/")) {
      nuevoVector.push(eval(valor));
    }
  }
  return nuevoVector;
  }

function imprimirMatriz(matriz) {
  for (let i = 0; i < matriz.length; i++) {
      console.log(matriz[i]); 
  }
  }

  function menorValorPosicionO(vector) {
    var vectorArray = vector.toArray();
    var posicionMinimoO = 0;
    var minimoO = Infinity;
  
    for (let i = 0; i < vectorArray.length; i++) {
      if (vectorArray[i] > 0 && vectorArray[i] < minimoO) {
        minimoO = vectorArray[i];
        posicionMinimoO = i;
      }
    }

    return {
      minimoO,
      posicionMinimoO
    };
  }

function menorValorPosicionR(vector){
  var vectorArray = vector.toArray();
  var valorNegativoEncontrado = false;
  var minimoR = Infinity;
  var posicionMinimoR = 0;

  for (let i = 0; i < vectorArray.length; i++) {
    if (vectorArray[i] < minimoR) {
      minimoR = vectorArray[i];
      posicionMinimoR = i;
    }
    if (vectorArray[i] < 0) {
      valorNegativoEncontrado = true;
    }
  }
  return {
    valorNegativoEncontrado,
    minimoR,
    posicionMinimoR
};
  }

function reemplazarColumnas(matrizB,posicionMinimoO,matrizAnum,posicionMinimoR,vectorXb,vectorCbnum,vectorX,vectorCnum){
  for (let i = 0; i < matrizB.length; i++) {
    matrizB[i][posicionMinimoO] = matrizAnum[i][posicionMinimoR];
    }
    document.getElementById("entrasale").style.display = 'block';
    var entrasale = document.getElementById('entrasale');
    entrasale.textContent = "Ingresó la variable "+vectorX[posicionMinimoR]+" y salió de la base "+vectorXb[posicionMinimoO]
  vectorXb[posicionMinimoO]=vectorX[posicionMinimoR]
  vectorCbnum[posicionMinimoO]=vectorCnum[posicionMinimoR]
  
  return {
    matrizB,
    vectorXb,
    vectorCbnum
};
  }

  function puntoDegenerado(lista) {
    for (var i = 0; i < lista.length; i++) {
      if (lista[i] === 0) {
        return true;
      }
    }
    return false;
  }
  

function solucionesAlternativas(vectorX, vectorXb, resultado3) {
  const resultado3array = resultado3.toArray();

  const numerosNegativos = resultado3array.some(numero => numero < 0);
  if (numerosNegativos) {
    return;
  }

  const elementosRestantes = vectorX.filter(elemento => !vectorXb.includes(elemento));
  const posicionesRestantes = elementosRestantes.map(elemento => vectorX.indexOf(elemento));
  if (posicionesRestantes.some(posicion => resultado3array[posicion] === 0)) {
    console.log("Existen soluciones alternativas.");
    document.getElementById("solucionesalternativas").style.display = 'block';
    var solucionesalternativas = document.getElementById('solucionesalternativas');
    solucionesalternativas.textContent = "Se han encontrado múltiples soluciones óptimas en el problema. Por favor, tenga en cuenta que existen varias soluciones que satisfacen los criterios de optimización"
  }
}

function poliedroAbierto(resultado7array) {
  for (let i = 0; i < resultado7array.length; i++) {
    if (resultado7array[i] >= 0) {
      return false; // Si encuentra un valor positivo, retorna falso
    }
  }
  return true; // Si no encuentra ningún valor positivo, retorna verdadero
}

function incompatible(vectorXb, resultado3) {
  const resultado3array = resultado3.toArray();

  const numerosNegativos = resultado3array.some(numero => numero < 0);
  if (numerosNegativos) {
    return;
  }
  
  const posicionesM = [];
  vectorXb.forEach((elemento, index) => {
    if (elemento.includes('m')) {
      posicionesM.push(index);
    }
  });

  if (posicionesM.length > 0) {
    document.getElementById("incompatible").style.display = 'block';
    var incompatible = document.getElementById('incompatible');
    incompatible.textContent = "El problema es incompatible y no tiene solución factible."
    error=true;
    console.log(`El vector es incompatible debido a la presencia de 'm'.`);
    posicionesM.forEach(posicion => {
      console.log(`'m' se encuentra en la posición ${posicion} y su elemento es ${vectorXb[posicion]}.`);
    });
  }
}

function mostrarSolucionesVariables(lista1, lista2) {
  if (lista1.length !== lista2.length) {
    throw new Error('Las listas deben tener la misma longitud.');
  }

  var resultado = '';
  for (var i = 0; i < lista1.length; i++) {
    resultado += lista1[i] + '=' + lista2[i];
    if (i !== lista1.length - 1) {
      resultado += ', ';
    }
  }

  return resultado;
}