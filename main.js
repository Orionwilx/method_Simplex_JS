let funcionObjetivoVanilla;
let restriccionesVanilla;
let func_objetivo;
let restriccionesDesigualdad;
let restriccionesIgualdad;
let variablesArtificiales;
let funcionObjetivoNueva;
let vectorX;
let vectorC;
let vectorB;
let matrizA;
let columnasIdentidad;
let matrizB;
let vectorXb;
let vectorCb;
let vectorCnum;
let vectorCbnum;
let vectorBnum;
let matrizAnum;
let n = 1;
let posicionMinimoR;
let minimoR;
let error = false;

function ejecucion() {
  funcionObjetivoVanilla = obtenerDatosFuncion();
  restriccionesVanilla = obtenerDatosRestricciones();

  if (objetivoFuncion == "Minimización") {
    func_objetivo = CambiarFuncionMaximizacion(funcionObjetivoVanilla);
  } else {
    func_objetivo = funcionObjetivoVanilla;
  }

  //let variables = ['x(1)', 'x(2)'];
  restriccionesDesigualdad = restriccionesVanilla;

  [restriccionesIgualdad, variablesArtificiales] =
    convertir_desigualdades_en_igualdades(restriccionesDesigualdad);
  funcionObjetivoNueva = agregar_variables_func_obj(
    func_objetivo,
    variablesArtificiales
  );
  vectorX = crearVectorX(funcionObjetivoNueva);
  vectorC = crearVectorC(funcionObjetivoNueva);
  vectorB = crearVectorB(restriccionesIgualdad);
  matrizA = crearMatrizA(restriccionesIgualdad, vectorX);

  console.log("Restricciones de entrada: ", restriccionesVanilla);
  console.log("Restricciones igualdad: ", restriccionesIgualdad);
  //console.log("varArti: ", variablesArtificiales);
  console.log("Funcion objetivo de entrada: ", funcionObjetivoVanilla);
  console.log("Funcion objetivo completa: ", funcionObjetivoNueva);
  console.log("\nVector X:    ", vectorX);
  console.log("\nVector C:    ", vectorC);
  console.log("\nVector B:    ", vectorB);
  console.log("matriz A:    ", matrizA);

  vectorCnum = convertirVectorANumericos(vectorC);
  vectorBnum = convertirVectorANumericos(vectorB);
  matrizAnum = convertirAFloatMatrizA(matrizA);

  columnasIdentidad = identificarColumnasIdentidad(matrizA);
  matrizB = crearMatrizB(matrizAnum, columnasIdentidad);
  ({ vectorXb, vectorCb } = crearVectoresMatrizB(
    vectorX,
    vectorCnum,
    columnasIdentidad
  ));
  console.log(
    "-------------------------------------------------------------------------------------------------- "
  );
  //console.log('Columnas identidad:', columnasIdentidad);
  console.log("vectorXb:", vectorXb);
  console.log("vectorCb:", vectorCb);
  console.log("MatrizA:  ");
  imprimirMatriz(matrizAnum);
  console.log("vectorC:  ", vectorCnum);
  console.log("vectorB:  ", vectorBnum);
  vectorCbnum = vectorCb;

  document.getElementById("restTittle2").style.display = "block";
  document.getElementById("funcTittle2").style.display = "block";
  document.getElementById("msgfuncionobjetivo").style.display = "block";
  mostrarFuncionCompleta(funcionObjetivoNueva);
  document.getElementById("msgrestricciones").style.display = "block";
  mostrarListaVerticalVectorRestricciones(restriccionesIgualdad);
  //mostrarListaVerticalVectorO(vectorBnum);
}
/* function iterar() {
  if (minimoR != 0) {
    borrarElementos();
    document.getElementById("restTittle2").style.display = "none";
    document.getElementById("funcTittle2").style.display = "none";
    document.getElementById("msgfuncionobjetivo").style.display = "none";
    document.getElementById("msgrestricciones").style.display = "none";
    document.getElementById("solucionesalternativas").style.display = "none";
    document.getElementById("incompatible").style.display = "none";
    document.getElementById("puntodegenerado").style.display = "none";
    document.getElementById("poliedroabierto").style.display = "none";
    console.log("\n");
    console.log("...........ITERACION [", n, "]..........");
    console.log("\n");

    document.getElementById("niteracion").style.display = "block";
    var niteracion = document.getElementById("niteracion");
    niteracion.textContent = "Iteración numero: " + n + "";

    if (n != 1) {
      ({ matrizB, vectorXb, vectorCbnum } = reemplazarColumnas(
        matrizB,
        posicionMinimoO,
        matrizAnum,
        posicionMinimoR,
        vectorXb,
        vectorCbnum,
        vectorX,
        vectorCnum
      ));
    }
    matrizBnuminv = math.inv(matrizB);
    resultado1 = math.multiply(
      math.matrix(vectorCbnum),
      math.matrix(matrizBnuminv)
    );
    resultado2 = math.multiply(resultado1, math.matrix(matrizAnum));
    resultado3 = math.round(
      math.subtract(resultado2, math.matrix(vectorCnum)),
      3
    );
    //posicion devalor minimo de r
    ({ valorNegativoEncontrado, minimoR, posicionMinimoR } =
      menorValorPosicionR(resultado3));
    // b-1*A
    resultado4 = math.round(
      math.multiply(math.matrix(matrizBnuminv), math.matrix(matrizAnum)),
      3
    );
    //b-1*B
    resultado5 = math.round(
      math.multiply(math.matrix(matrizBnuminv), math.matrix(vectorBnum)),
      3
    );
    //Z
    resultado6 = math.multiply(math.matrix(vectorCbnum), resultado5);
    //extraer posicon del menor de r
    columna = resultado4.toArray().map((fila) => fila[posicionMinimoR]);
    //Vector o
    resultado7 = math.round(math.dotDivide(resultado5, columna), 3);
    ({ minimoO, posicionMinimoO } = menorValorPosicionO(resultado7));
    //console.log("Se encontró negativo:  ",valorNegativoEncontrado)
    console.log("vectorXb:  ", vectorXb);
    console.log("vectorCb:  ", vectorCbnum);
    console.log("Matriz B:", math.matrix(matrizB).toArray());
    console.log("matrizBnuminv: ", matrizBnuminv);
    console.log(
      "vector R: ",
      math.format(resultado3),
      " --menor valor[",
      minimoR,
      "] posicion[",
      posicionMinimoR,
      "]"
    );
    console.log("Matriz b-1*A: ", resultado4);
    console.log("Vector b-1*B:  ", math.format(resultado5));
    console.log("Z: ", resultado6);
    console.log(
      "vector O:  ",
      math.format(resultado7),
      " --menor valor[",
      minimoO,
      "] posicion[",
      posicionMinimoO,
      "]"
    );

    //punto degenerado
    if (puntoDegenerado(resultado5.toArray()) == true) {
      console.log("Se encontro un punto degenerado");
      document.getElementById("puntodegenerado").style.display = "block";
      var poliedroabierto = document.getElementById("puntodegenerado");
      poliedroabierto.textContent =
        "Se ha detectado un punto degenerado en el problema. Esto puede afectar la convergencia del método";
    }

    //soluciones alternativas
    solucionesAlternativas(vectorX, vectorXb, resultado3);

    //poliedro abierto
    if (poliedroAbierto(resultado7.toArray()) == true) {
      document.getElementById("poliedroabierto").style.display = "block";
      var poliedroabierto = document.getElementById("poliedroabierto");
      poliedroabierto.textContent =
        "Se ha detectado un poliedro abierto en el problema. Esto implica que no existe una solución óptima finita, y el proceso del método simplex no puede converger";
      console.log("poliedro abierto");
      minimoR = 0;
      error = true;
      // return;
    }
    //incompatible
    incompatible(vectorXb, resultado3);
    if (n == 1) {
      mostrarListaHorizontalVectorX(vectorX);
      mostrarListaVerticalVectorB(resultado5.toArray());
      mostrarMatrizA(resultado4.toArray());
      n++;
    }
    if (n != 1) {
      mostrarListaHorizontalVectorC(vectorCnum);
      mostrarListaHorizontalVectorX(vectorX);
      mostrarListaVerticalVectorCb(vectorCbnum);
      mostrarListaVerticalVectorXb(vectorXb);
      mostrarListaVerticalVectorB(resultado5.toArray());
      mostrarMatrizA(resultado4.toArray());
      mostrarListaVerticalVectorO(resultado7.toArray());
      mostrarListaHorizontalVectorR(resultado6, resultado3.toArray());
      n++;
    }

    if (minimoR === 0 && error === false) {
      document.getElementById("iterar").style.display = "none";
      document.getElementById("solucionDirecta").style.display = "none";
      document.getElementById("msgresultado").style.display = "block";
      document.getElementById("msgresultado2").style.display = "block";
      document.getElementById("reset").style.display = "block";
      var msgresultado = document.getElementById("msgresultado");
      var msgresultado2 = document.getElementById("msgresultado2");
      if (objetivoFuncion == "Minimización") {
        msgresultado.textContent =
          "La solucion optima es Z= " + -1 * resultado6;
        msgresultado2.textContent = mostrarSolucionesVariables(
          vectorXb,
          resultado5.toArray()
        );
      } else {
        msgresultado.textContent = "La solucion optima es Z=" + resultado6;
        msgresultado2.textContent = mostrarSolucionesVariables(
          vectorXb,
          resultado5.toArray()
        );
      }
    } else if (minimoR === 0 && error === true) {
      document.getElementById("iterar").style.display = "none";
      document.getElementById("solucionDirecta").style.display = "none";
      document.getElementById("reset").style.display = "block";
    }
  }
}
*/
function iterar() {
  if (minimoR != 0) {
    borrarElementos();
    document.getElementById("restTittle2").style.display = "none";
    document.getElementById("funcTittle2").style.display = "none";
    document.getElementById("msgfuncionobjetivo").style.display = "none";
    document.getElementById("msgrestricciones").style.display = "none";
    document.getElementById("solucionesalternativas").style.display = "none";
    document.getElementById("incompatible").style.display = "none";
    document.getElementById("puntodegenerado").style.display = "none";
    document.getElementById("poliedroabierto").style.display = "none";
    console.log("\n");
    console.log("...........ITERACION [", n, "]..........");
    console.log("\n");

    document.getElementById("niteracion").style.display = "block";
    var niteracion = document.getElementById("niteracion");
    niteracion.textContent = "Iteración numero: " + n + "";

    if (n != 1) {
      ({ matrizB, vectorXb, vectorCbnum } = reemplazarColumnas(
        matrizB,
        posicionMinimoO,
        matrizAnum,
        posicionMinimoR,
        vectorXb,
        vectorCbnum,
        vectorX,
        vectorCnum
      ));
    }
    matrizBnuminv = math.inv(matrizB);
    resultado1 = math.multiply(
      math.matrix(vectorCbnum),
      math.matrix(matrizBnuminv)
    );
    resultado2 = math.multiply(resultado1, math.matrix(matrizAnum));
    resultado3 = math.round(
      math.subtract(resultado2, math.matrix(vectorCnum)),
      3
    );
    //posicion devalor minimo de r
    ({ valorNegativoEncontrado, minimoR, posicionMinimoR } =
      menorValorPosicionR(resultado3));
    // b-1*A
    resultado4 = math.round(
      math.multiply(math.matrix(matrizBnuminv), math.matrix(matrizAnum)),
      3
    );
    //b-1*B
    resultado5 = math.round(
      math.multiply(math.matrix(matrizBnuminv), math.matrix(vectorBnum)),
      3
    );
    //Z
    resultado6 = math.multiply(math.matrix(vectorCbnum), resultado5);
    //extraer posicon del menor de r
    columna = resultado4.toArray().map((fila) => fila[posicionMinimoR]);
    //Vector o
    resultado7 = math.round(math.dotDivide(resultado5, columna), 3);
    ({ minimoO, posicionMinimoO } = menorValorPosicionO(resultado7));
    //console.log("Se encontró negativo:  ",valorNegativoEncontrado)
    console.log("vectorXb:  ", vectorXb);
    console.log("vectorCb:  ", vectorCbnum);
    console.log("Matriz B:", math.matrix(matrizB).toArray());
    console.log("matrizBnuminv: ", matrizBnuminv);
    console.log(
      "vector R: ",
      math.format(resultado3),
      " --menor valor[",
      minimoR,
      "] posicion[",
      posicionMinimoR,
      "]"
    );
    console.log("Matriz b-1*A: ", resultado4);
    console.log("Vector b-1*B:  ", math.format(resultado5));
    console.log("Z: ", resultado6);
    console.log(
      "vector O:  ",
      math.format(resultado7),
      " --menor valor[",
      minimoO,
      "] posicion[",
      posicionMinimoO,
      "]"
    );

    //punto degenerado
    if (puntoDegenerado(resultado5.toArray()) == true) {
      console.log("Se encontro un punto degenerado");
      document.getElementById("puntodegenerado").style.display = "block";
      var poliedroabierto = document.getElementById("puntodegenerado");
      poliedroabierto.textContent =
        "Se ha detectado un punto degenerado en el problema. Esto puede afectar la convergencia del método";
    }

    //soluciones alternativas
    solucionesAlternativas(vectorX, vectorXb, resultado3);

    //poliedro abierto
    if (poliedroAbierto(resultado7.toArray()) == true) {
      document.getElementById("poliedroabierto").style.display = "block";
      var poliedroabierto = document.getElementById("poliedroabierto");
      poliedroabierto.textContent =
        "Se ha detectado un poliedro abierto en el problema. Esto implica que no existe una solución óptima finita, y el proceso del método simplex no puede converger";
      console.log("poliedro abierto");
      minimoR = 0;
      error = true;
      // return;
    }
    //incompatible
    incompatible(vectorXb, resultado3);

    if (n == 1) {
      mostrarListaHorizontalVectorX(vectorX);
      mostrarListaVerticalVectorB(resultado5.toArray());
      mostrarMatrizA(resultado4.toArray());
      n++;
    } else {
      mostrarListaHorizontalVectorC(vectorCnum);
      mostrarListaHorizontalVectorX(vectorX);
      mostrarListaVerticalVectorCb(vectorCbnum);
      mostrarListaVerticalVectorXb(vectorXb);
      mostrarListaVerticalVectorB(resultado5.toArray());
      mostrarMatrizA(resultado4.toArray());
      mostrarListaVerticalVectorO(resultado7.toArray());
      mostrarListaHorizontalVectorR(resultado6, resultado3.toArray());
      n++;
    }

    if (minimoR === 0 && error === false) {
      document.getElementById("iterar").style.display = "none";
      document.getElementById("solucionDirecta").style.display = "none";
      document.getElementById("msgresultado").style.display = "block";
      document.getElementById("msgresultado2").style.display = "block";
      document.getElementById("reset").style.display = "block";
      var msgresultado = document.getElementById("msgresultado");
      var msgresultado2 = document.getElementById("msgresultado2");
      if (objetivoFuncion == "Minimización") {
        msgresultado.textContent =
          "La solucion optima es Z= " + -1 * resultado6;
        msgresultado2.textContent = mostrarSolucionesVariables(
          vectorXb,
          resultado5.toArray()
        );
      } else {
        msgresultado.textContent = "La solucion optima es Z=" + resultado6;
        msgresultado2.textContent = mostrarSolucionesVariables(
          vectorXb,
          resultado5.toArray()
        );
      }
    } else if (minimoR === 0 && error === true) {
      document.getElementById("iterar").style.display = "none";
      document.getElementById("solucionDirecta").style.display = "none";
      document.getElementById("reset").style.display = "block";
    }
  }
}

function solucionDirecta() {
  if (minimoR != 0) {
    borrarElementos();
    document.getElementById("niteracion").style.display = "block";
    var niteracion = document.getElementById("niteracion");
    niteracion.textContent = "Iteracion numero:" + n + "";
    for (n = 1; minimoR != 0 && n <= 50; n++) {
      console.log("\n");
      console.log(
        "....................................ITERACION [",
        n,
        "].............................."
      );
      console.log("\n");
      if (n != 1) {
        ({ matrizB, vectorXb, vectorCbnum } = reemplazarColumnas(
          matrizB,
          posicionMinimoO,
          matrizAnum,
          posicionMinimoR,
          vectorXb,
          vectorCbnum,
          vectorX,
          vectorCnum
        ));
      }
      matrizBnuminv = math.inv(matrizB);
      resultado1 = math.multiply(
        math.matrix(vectorCbnum),
        math.matrix(matrizBnuminv)
      );
      resultado2 = math.multiply(resultado1, math.matrix(matrizAnum));
      resultado3 = math.round(
        math.subtract(resultado2, math.matrix(vectorCnum)),
        3
      );
      //posicion devalor minimo de r
      ({ valorNegativoEncontrado, minimoR, posicionMinimoR } =
        menorValorPosicionR(resultado3));
      // b-1*A
      resultado4 = math.round(
        math.multiply(math.matrix(matrizBnuminv), math.matrix(matrizAnum)),
        3
      );
      //b-1*B
      resultado5 = math.round(
        math.multiply(math.matrix(matrizBnuminv), math.matrix(vectorBnum)),
        3
      );
      //Z
      resultado6 = math.multiply(math.matrix(vectorCbnum), resultado5);
      //extraer posicon del menor de r
      columna = resultado4.toArray().map((fila) => fila[posicionMinimoR]);
      //Vector o
      resultado7 = math.round(math.dotDivide(resultado5, columna));
      ({ minimoO, posicionMinimoO } = menorValorPosicionO(resultado7));
      //console.log("Se encontró negativo:  ",valorNegativoEncontrado)
      console.log("vectorXb:  ", vectorXb);
      console.log("vectorCb:  ", vectorCbnum);
      console.log("Matriz B:", math.matrix(matrizB).toArray());
      console.log("matrizBnuminv: ", matrizBnuminv);
      console.log(
        "vector R: ",
        math.format(resultado3),
        " --menor valor[",
        minimoR,
        "] posicion[",
        posicionMinimoR,
        "]"
      );
      console.log("Matriz b-1*A: ", resultado4);
      console.log("Vector b-1*B:  ", math.format(resultado5));
      console.log("Z: ", resultado6);
      console.log(
        "vector O:  ",
        math.format(resultado7),
        " --menor valor[",
        minimoO,
        "] posicion[",
        posicionMinimoO,
        "]"
      );
      //punto degenerado
      if (puntoDegenerado(resultado7.toArray()) == true) {
        console.log("Se encontro un punto degenerado");
      }
      //soluciones alternativas
      solucionesAlternativas(vectorX, vectorXb, resultado3);
      //poliedro abierto
      if (poliedroAbierto(resultado7.toArray()) == true) {
        console.log("poliedro abierto");
        minimoR = 0;
        break;
      }
      //incompatible
      incompatible(vectorXb, resultado3);
    }
    mostrarListaHorizontalVectorC(vectorCnum);
    mostrarListaHorizontalVectorX(vectorX);
    mostrarListaVerticalVectorCb(vectorCbnum);
    mostrarListaVerticalVectorXb(vectorXb);
    mostrarListaVerticalVectorB(vectorBnum);
    mostrarMatrizA(matrizAnum);
    mostrarListaVerticalVectorO(resultado7.toArray());
    mostrarListaHorizontalVectorR(resultado6, resultado3.toArray());
  } else {
    console.log("Ya acabé");
  }
}
