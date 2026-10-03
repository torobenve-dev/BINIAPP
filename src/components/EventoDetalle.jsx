import { useEffect, useState } from "react"

import { useAuth } from "../auth/AuthContext"

import {
  cargarDetalleEvento,
  actualizarEstadoEvento,
  guardarBalancePostEvento,
  crearMaterial,
  modificarMaterial,
  borrarMaterial,
  crearPersona,
  modificarPersona,
  borrarPersona
} from "../services/eventosService"


// Convierte el texto del input de cantidad en un entero > 0.
// Vacío = 1. Devuelve null si el texto no es válido.
function leerCantidad(texto) {

  const limpio = texto.trim()

  if (limpio === "") {
    return 1
  }

  if (!/^\d+$/.test(limpio)) {
    return null
  }

  const numero = Number(limpio)

  return numero > 0 ? numero : null
}


function EventoDetalle({
  evento,
  volver,
  editarEvento,
  seccionInicial = "seccion-resumen"
}) {

  const { esEditor } = useAuth()

  const [estado, setEstado] =
    useState(evento.estado || "Confirmado")

  const [seccionActiva, setSeccionActiva] =
    useState(seccionInicial)

  const [problemasPostEvento, setProblemasPostEvento] =
    useState(evento.problemasPostEvento || "")

  const [positivosPostEvento, setPositivosPostEvento] =
    useState(evento.positivosPostEvento || "")

  const [guardandoPostEvento, setGuardandoPostEvento] =
    useState(false)

  const [materiales, setMateriales] =
    useState(evento.materiales || [])

  const [cantidadMaterial, setCantidadMaterial] =
    useState("")

  const [nombreMaterial, setNombreMaterial] =
    useState("")

  const [personal, setPersonal] =
    useState(evento.personal || [])

  const [nombrePersona, setNombrePersona] =
    useState("")

  const [rolPersona, setRolPersona] =
    useState("")

  const [cargandoDetalle, setCargandoDetalle] =
    useState(true)

  const [errorDatos, setErrorDatos] =
    useState("")


  // =========================================================
  // EDICIÓN DE MATERIALES
  // =========================================================

  const [materialEditando, setMaterialEditando] =
    useState(null)

  const [cantidadMaterialEditando, setCantidadMaterialEditando] =
    useState("")

  const [nombreMaterialEditando, setNombreMaterialEditando] =
    useState("")


  // =========================================================
  // EDICIÓN DE PERSONAL
  // =========================================================

  const [personaEditando, setPersonaEditando] =
    useState(null)

  const [nombrePersonaEditando, setNombrePersonaEditando] =
    useState("")

  const [rolPersonaEditando, setRolPersonaEditando] =
    useState("")


  // =========================================================
  // CARGAR MATERIALES Y PERSONAL DESDE SUPABASE
  // =========================================================

  useEffect(() => {

    let cancelado = false

    async function cargar() {

      setCargandoDetalle(true)

      try {

        const detalle =
          await cargarDetalleEvento(evento.id)

        if (cancelado) {
          return
        }

        setMateriales(detalle.materiales)
        setPersonal(detalle.personal)

      } catch (error) {

        console.error(
          "ERROR AL CARGAR EL DETALLE DEL EVENTO:",
          error
        )

        if (!cancelado) {
          setErrorDatos(
            "No se pudieron cargar los materiales y el personal."
          )
        }

      } finally {

        if (!cancelado) {
          setCargandoDetalle(false)
        }
      }
    }

    cargar()

    return () => {
      cancelado = true
    }

  }, [evento.id])


  // =========================================================
  // ESTADO
  // =========================================================

  async function cambiarEstado(nuevoEstado) {

    const estadoAnterior = estado

    setErrorDatos("")
    setEstado(nuevoEstado)

    try {

      await actualizarEstadoEvento(
        evento.id,
        nuevoEstado
      )

    } catch (error) {

      console.error(
        "ERROR AL CAMBIAR EL ESTADO:",
        error
      )

      setEstado(estadoAnterior)

      setErrorDatos(
        "No se pudo cambiar el estado del evento."
      )
    }
  }


  // =========================================================
  // MATERIALES
  // =========================================================

  async function agregarMaterial(e) {

    e.preventDefault()

    setErrorDatos("")

    const nombre = nombreMaterial.trim()

    if (!nombre) {
      return
    }

    const cantidad =
      leerCantidad(cantidadMaterial)

    if (cantidad === null) {
      setErrorDatos(
        "La cantidad tiene que ser un número entero mayor a 0."
      )
      return
    }

    try {

      const nuevoMaterial =
        await crearMaterial(
          evento.id,
          { nombre, cantidad }
        )

      setMateriales((lista) => [
        ...lista,
        nuevoMaterial
      ])

      setCantidadMaterial("")
      setNombreMaterial("")

    } catch (error) {

      console.error(
        "ERROR AL AGREGAR MATERIAL:",
        error
      )

      setErrorDatos(
        "No se pudo agregar el material."
      )
    }
  }


  async function cambiarEstadoMaterial(id) {

    const material =
      materiales.find(
        (item) => item.id === id
      )

    if (!material) {
      return
    }

    const nuevoValor = !material.guardado

    setErrorDatos("")

    function marcar(valor) {
      setMateriales((lista) =>
        lista.map((item) =>
          item.id === id
            ? { ...item, guardado: valor }
            : item
        )
      )
    }

    marcar(nuevoValor)

    try {

      await modificarMaterial(
        id,
        { guardado: nuevoValor }
      )

    } catch (error) {

      console.error(
        "ERROR AL ACTUALIZAR MATERIAL:",
        error
      )

      marcar(!nuevoValor)

      setErrorDatos(
        "No se pudo actualizar el material."
      )
    }
  }


  async function eliminarMaterial(id) {

    setErrorDatos("")

    try {

      await borrarMaterial(id)

      setMateriales((lista) =>
        lista.filter(
          (material) =>
            material.id !== id
        )
      )

    } catch (error) {

      console.error(
        "ERROR AL ELIMINAR MATERIAL:",
        error
      )

      setErrorDatos(
        "No se pudo eliminar el material."
      )
    }
  }


  function iniciarEdicionMaterial(material) {

    setMaterialEditando(
      material.id
    )

    setCantidadMaterialEditando(
      String(material.cantidad)
    )

    setNombreMaterialEditando(
      material.nombre
    )
  }


  function cancelarEdicionMaterial() {

    setMaterialEditando(null)

    setCantidadMaterialEditando("")

    setNombreMaterialEditando("")
  }


  async function guardarEdicionMaterial(e) {

    e.preventDefault()

    setErrorDatos("")

    const nombre =
      nombreMaterialEditando.trim()

    if (!nombre) {
      return
    }

    const cantidad =
      leerCantidad(cantidadMaterialEditando)

    if (cantidad === null) {
      setErrorDatos(
        "La cantidad tiene que ser un número entero mayor a 0."
      )
      return
    }

    try {

      const materialActualizado =
        await modificarMaterial(
          materialEditando,
          { nombre, cantidad }
        )

      setMateriales((lista) =>
        lista.map((material) =>
          material.id === materialEditando
            ? materialActualizado
            : material
        )
      )

      cancelarEdicionMaterial()

    } catch (error) {

      console.error(
        "ERROR AL EDITAR MATERIAL:",
        error
      )

      setErrorDatos(
        "No se pudieron guardar los cambios del material."
      )
    }
  }


  // =========================================================
  // PERSONAL
  // =========================================================

  async function agregarPersona(e) {

    e.preventDefault()

    setErrorDatos("")

    const nombre = nombrePersona.trim()

    if (!nombre) {
      return
    }

    try {

      const nuevaPersona =
        await crearPersona(
          evento.id,
          {
            nombre,
            rol: rolPersona.trim()
          }
        )

      setPersonal((lista) => [
        ...lista,
        nuevaPersona
      ])

      setNombrePersona("")
      setRolPersona("")

    } catch (error) {

      console.error(
        "ERROR AL AGREGAR PERSONAL:",
        error
      )

      setErrorDatos(
        "No se pudo agregar a la persona."
      )
    }
  }


  async function eliminarPersona(id) {

    setErrorDatos("")

    try {

      await borrarPersona(id)

      setPersonal((lista) =>
        lista.filter(
          (persona) =>
            persona.id !== id
        )
      )

    } catch (error) {

      console.error(
        "ERROR AL ELIMINAR PERSONAL:",
        error
      )

      setErrorDatos(
        "No se pudo eliminar a la persona."
      )
    }
  }


  function iniciarEdicionPersona(persona) {

    setPersonaEditando(
      persona.id
    )

    setNombrePersonaEditando(
      persona.nombre
    )

    setRolPersonaEditando(
      persona.rol || ""
    )
  }


  function cancelarEdicionPersona() {

    setPersonaEditando(null)

    setNombrePersonaEditando("")

    setRolPersonaEditando("")
  }


  async function guardarEdicionPersona(e) {

    e.preventDefault()

    setErrorDatos("")

    const nombre =
      nombrePersonaEditando.trim()

    if (!nombre) {
      return
    }

    try {

      const personaActualizada =
        await modificarPersona(
          personaEditando,
          {
            nombre,
            rol: rolPersonaEditando.trim()
          }
        )

      setPersonal((lista) =>
        lista.map((persona) =>
          persona.id === personaEditando
            ? personaActualizada
            : persona
        )
      )

      cancelarEdicionPersona()

    } catch (error) {

      console.error(
        "ERROR AL EDITAR PERSONAL:",
        error
      )

      setErrorDatos(
        "No se pudieron guardar los cambios de la persona."
      )
    }
  }


  // =========================================================
  // POST EVENTO
  // =========================================================

  async function guardarPostEvento() {

    setErrorDatos("")
    setGuardandoPostEvento(true)

    try {

      await guardarBalancePostEvento(
        evento.id,
        {
          problemas: problemasPostEvento,
          positivos: positivosPostEvento
        }
      )

    } catch (error) {

      console.error(
        "ERROR AL GUARDAR EL BALANCE:",
        error
      )

      setErrorDatos(
        "No se pudo guardar el balance del evento."
      )

    } finally {

      setGuardandoPostEvento(false)
    }
  }


  // =========================================================
  // FORMATOS
  // =========================================================

  function formatearFecha(fecha) {

    if (!fecha) {
      return "Sin definir"
    }

    const partes =
      fecha.split("-")

    if (partes.length !== 3) {
      return fecha
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }


  function formatearHora(hora) {

    if (!hora) {
      return "Sin definir"
    }

    return hora
  }


  // =========================================================
  // ESTADOS DE SECCIONES
  // =========================================================

  function obtenerEstadoSeccion(seccion) {

    if (
      cargandoDetalle &&
      (seccion === "materiales" || seccion === "personal")
    ) {
      return {
        completa: false,
        texto: "Cargando..."
      }
    }

    if (seccion === "pantalla") {

      const completa =
        evento.tipoPantalla &&
        evento.pitch &&
        evento.medidasPantalla

      return completa
        ? {
            completa: true,
            texto: "Información completa"
          }
        : {
            completa: false,
            texto: "Información incompleta"
          }
    }


    if (seccion === "materiales") {

      const completa =
        materiales.length > 0

      return completa
        ? {
            completa: true,
            texto: "Materiales cargados"
          }
        : {
            completa: false,
            texto: "No hay materiales cargados"
          }
    }


    if (seccion === "personal") {

      const completa =
        personal.length > 0

      return completa
        ? {
            completa: true,
            texto: "Personal asignado"
          }
        : {
            completa: false,
            texto: "No hay personal asignado"
          }
    }


    return {
      completa: true,
      texto: "Información disponible"
    }
  }


  function obtenerEstadoCronograma(tipo) {

    if (estado === "Finalizado") {
      return {
        clase: "completado",
        texto: "Completado"
      }
    }

    if (
      estado === "En armado" &&
      tipo === "armado"
    ) {
      return {
        clase: "activo",
        texto: "En curso"
      }
    }

    if (
      estado === "En operación" &&
      tipo === "evento"
    ) {
      return {
        clase: "activo",
        texto: "En curso"
      }
    }

    return {
      clase: "pendiente",
      texto: "Planificado"
    }
  }


  // =========================================================
  // OBSERVER DE SECCIONES
  // =========================================================

  useEffect(() => {

    const secciones = [
      "seccion-resumen",
      "seccion-pantalla",
      "seccion-materiales",
      "seccion-personal",
      "seccion-consideraciones",
      "seccion-postevento"
    ]

    const elementos =
      secciones
        .map((id) =>
          document.getElementById(id)
        )
        .filter(Boolean)

    const observer =
      new IntersectionObserver(
        (entradas) => {

          const visibles =
            entradas
              .filter(
                (entrada) =>
                  entrada.isIntersecting
              )
              .sort(
                (a, b) =>
                  a.boundingClientRect.top -
                  b.boundingClientRect.top
              )

          if (visibles.length > 0) {

            setSeccionActiva(
              visibles[0].target.id
            )
          }
        },
        {
          rootMargin:
            "-15% 0px -60% 0px"
        }
      )

    elementos.forEach(
      (elemento) =>
        observer.observe(elemento)
    )

    return () => {
      observer.disconnect()
    }

  }, [])


  useEffect(() => {

    if (!seccionInicial) {
      return
    }

    const temporizador =
      setTimeout(() => {

        const elemento =
          document.getElementById(
            seccionInicial
          )

        if (elemento) {

          elemento.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        }

      }, 100)

    return () => {
      clearTimeout(temporizador)
    }

  }, [seccionInicial])


  function irASeccion(id) {

    const elemento =
      document.getElementById(id)

    if (!elemento) {
      return
    }

    setSeccionActiva(id)

    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }


  const estadoPantalla =
    obtenerEstadoSeccion("pantalla")

  const estadoMateriales =
    obtenerEstadoSeccion("materiales")

  const estadoPersonal =
    obtenerEstadoSeccion("personal")

  const estadoArmado =
    obtenerEstadoCronograma("armado")

  const estadoEvento =
    obtenerEstadoCronograma("evento")

  const estadoDesarme =
    obtenerEstadoCronograma("desarme")


  return (

    <div className="app detalle-app">

      {errorDatos && (
        <p className="error">
          {errorDatos}
        </p>
      )}



      {/* HEADER */}

      <header className="detalle-header">

        <div className="detalle-header-superior">

          <button
            className="detalle-volver"
            onClick={volver}
          >
            ← Volver
          </button>

        </div>


        <div className="detalle-header-contenido">

          <div>

            <span className="detalle-marca">
              BINIVISION
            </span>

            <h1>
              {evento.nombre}
            </h1>

            <p className="detalle-lugar">
              📍 {evento.lugar}
            </p>

          </div>


          <div className="detalle-header-acciones">

            <span
              className={`detalle-estado detalle-estado-${estado
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              {estado}
            </span>

            {esEditor && (
<button
              className="detalle-editar"
              onClick={() =>
                editarEvento(evento)
              }
            >
              Editar evento
            </button>
)}

          </div>

        </div>


        <div className="detalle-datos-principales">

          <div>

            <span>EVENTO</span>

            <strong>
              {formatearFecha(
                evento.fechaInicio ||
                evento.fecha
              )}
            </strong>

          </div>


          <div>

            <span>ARMADO</span>

            <strong>
              {formatearFecha(
                evento.fechaArmado
              )}
            </strong>

            <small>
              {evento.horaArmado
                ? `🕐 ${evento.horaArmado}`
                : "Hora sin definir"}
            </small>

          </div>


          <div>

            <span>DESARME</span>

            <strong>
              {formatearFecha(
                evento.fechaDesarme
              )}
            </strong>

            <small>
              {evento.horaDesarme
                ? `🕐 ${evento.horaDesarme}`
                : "Hora sin definir"}
            </small>

          </div>


          <div>

            <span>CONTACTO</span>

            <strong>
              {evento.contacto ||
                "Sin definir"}
            </strong>

          </div>

        </div>


        <div className="detalle-selector-estado">

          <span>
            Estado del evento
          </span>

          <select
            value={estado}
            disabled={!esEditor}
            onChange={(e) =>
              cambiarEstado(
                e.target.value
              )
            }
          >

            <option>
              Confirmado
            </option>

            <option>
              En armado
            </option>

            <option>
              En operación
            </option>

            <option>
              Finalizado
            </option>

          </select>

        </div>

      </header>


      {/* MENÚ */}

      <nav className="detalle-menu">

        <button
          className={
            seccionActiva ===
            "seccion-resumen"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-resumen"
            )
          }
        >
          Resumen
        </button>


        <button
          className={
            seccionActiva ===
            "seccion-pantalla"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-pantalla"
            )
          }
        >
          Pantalla
        </button>


        <button
          className={
            seccionActiva ===
            "seccion-materiales"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-materiales"
            )
          }
        >
          Materiales
        </button>


        <button
          className={
            seccionActiva ===
            "seccion-personal"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-personal"
            )
          }
        >
          Personal
        </button>


        <button
          className={
            seccionActiva ===
            "seccion-consideraciones"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-consideraciones"
            )
          }
        >
          Consideraciones
        </button>


        <button
          className={
            seccionActiva ===
            "seccion-postevento"
              ? "activo"
              : ""
          }
          onClick={() =>
            irASeccion(
              "seccion-postevento"
            )
          }
        >
          Post-evento
        </button>

      </nav>


      <main className="detalle-contenido">


        {/* RESUMEN */}

        <section
          id="seccion-resumen"
          className="detalle-seccion"
        >

          <div className="detalle-seccion-titulo">

            <span>
              RESUMEN
            </span>

            <h2>
              Información operativa
            </h2>

            <p>
              Vista general de la producción.
            </p>

          </div>


          <div className="detalle-resumen-grid">


            <div className="detalle-resumen-card">

              <span>🔧</span>

              <div>

                <small>
                  ARMADO
                </small>

                <strong>
                  {formatearFecha(
                    evento.fechaArmado
                  )}
                </strong>

                <em>
                  🕐{" "}
                  {evento.horaArmado ||
                    "Hora sin definir"}
                </em>

              </div>

            </div>


            <div className="detalle-resumen-card">

              <span>🎤</span>

              <div>

                <small>
                  EVENTO
                </small>

                <strong>
                  {formatearFecha(
                    evento.fechaInicio ||
                    evento.fecha
                  )}
                </strong>

                <em>
                  {evento.fechaFin &&
                  evento.fechaFin !==
                    evento.fechaInicio
                    ? `Hasta ${formatearFecha(
                        evento.fechaFin
                      )}`
                    : "Fecha de evento"}
                </em>

              </div>

            </div>


            <div className="detalle-resumen-card">

              <span>📦</span>

              <div>

                <small>
                  DESARME
                </small>

                <strong>
                  {formatearFecha(
                    evento.fechaDesarme
                  )}
                </strong>

                <em>
                  🕐{" "}
                  {evento.horaDesarme ||
                    "Hora sin definir"}
                </em>

              </div>

            </div>


            <div className="detalle-resumen-card">

              <span>👥</span>

              <div>

                <small>
                  PERSONAL
                </small>

                <strong>
                  {personal.length}
                  {" "}
                  {personal.length === 1
                    ? "persona"
                    : "personas"}
                </strong>

              </div>

            </div>

          </div>


          {/* CRONOGRAMA */}

          <div className="detalle-cronograma">

            <div className="detalle-cronograma-titulo">

              <span>
                CRONOGRAMA
              </span>

              <h3>
                Etapas de producción
              </h3>

              <p>
                Organización temporal del evento.
              </p>

            </div>


            <div className="detalle-cronograma-lista">


              {/* ARMADO */}

              <div
                className={`detalle-cronograma-item ${estadoArmado.clase}`}
              >

                <div className="detalle-cronograma-icono">
                  🔧
                </div>


                <div className="detalle-cronograma-info">

                  <div className="detalle-cronograma-cabecera">

                    <strong>
                      Armado
                    </strong>

                    <span>
                      {estadoArmado.texto}
                    </span>

                  </div>


                  <p>
                    Preparación y montaje de la producción.
                  </p>


                  <div className="detalle-cronograma-fecha">

                    <strong>
                      📅{" "}
                      {formatearFecha(
                        evento.fechaArmado
                      )}
                    </strong>

                    <span>
                      🕐{" "}
                      {evento.horaArmado ||
                        "Hora sin definir"}
                    </span>

                  </div>

                </div>

              </div>


              {/* EVENTO */}

              <div
                className={`detalle-cronograma-item ${estadoEvento.clase}`}
              >

                <div className="detalle-cronograma-icono">
                  🎤
                </div>


                <div className="detalle-cronograma-info">

                  <div className="detalle-cronograma-cabecera">

                    <strong>
                      Evento
                    </strong>

                    <span>
                      {estadoEvento.texto}
                    </span>

                  </div>


                  <p>
                    Operación y desarrollo del evento.
                  </p>


                  <div className="detalle-cronograma-fecha">

                    <strong>
                      📅{" "}
                      {formatearFecha(
                        evento.fechaInicio ||
                        evento.fecha
                      )}
                    </strong>

                    <span>

                      {evento.fechaFin &&
                      evento.fechaFin !==
                        evento.fechaInicio
                        ? `Hasta ${formatearFecha(
                            evento.fechaFin
                          )}`
                        : "Sin fecha de finalización"}

                    </span>

                  </div>

                </div>

              </div>


              {/* DESARME */}

              <div
                className={`detalle-cronograma-item ${estadoDesarme.clase}`}
              >

                <div className="detalle-cronograma-icono">
                  📦
                </div>


                <div className="detalle-cronograma-info">

                  <div className="detalle-cronograma-cabecera">

                    <strong>
                      Desarme
                    </strong>

                    <span>
                      {estadoDesarme.texto}
                    </span>

                  </div>


                  <p>
                    Desmontaje, carga y finalización.
                  </p>


                  <div className="detalle-cronograma-fecha">

                    <strong>
                      📅{" "}
                      {formatearFecha(
                        evento.fechaDesarme
                      )}
                    </strong>

                    <span>
                      🕐{" "}
                      {evento.horaDesarme ||
                        "Hora sin definir"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ESTADO DE PREPARACIÓN */}

          <div className="detalle-produccion">

            <div className="detalle-produccion-titulo">

              <span>
                PRODUCCIÓN
              </span>

              <h3>
                Estado de preparación
              </h3>

            </div>


            <div className="detalle-produccion-lista">

              <div className="detalle-produccion-item">

                <span>
                  Fecha de armado
                </span>

                <strong>
                  {formatearFecha(
                    evento.fechaArmado
                  )}
                  {" · "}
                  {evento.horaArmado ||
                    "Hora sin definir"}
                </strong>

              </div>


              <div className="detalle-produccion-item">

                <span>
                  Puesta de pantalla
                </span>

                <strong>
                  {evento.tipoPantalla
                    ? `${evento.tipoPantalla} · ${
                        evento.pitch || ""
                      } · ${
                        evento.medidasPantalla ||
                        ""
                      }`
                    : "Información pendiente"}
                </strong>

              </div>


              <div className="detalle-produccion-item">

                <span>
                  Personal asignado
                </span>

                <strong>
                  {personal.length > 0
                    ? `${personal.length} asignado${
                        personal.length === 1
                          ? ""
                          : "s"
                      }`
                    : "Pendiente"}
                </strong>

              </div>


              <div className="detalle-produccion-item">

                <span>
                  Materiales
                </span>

                <strong>
                  {materiales.length > 0
                    ? `${materiales.length} cargado${
                        materiales.length === 1
                          ? ""
                          : "s"
                      }`
                    : "Pendiente"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* PANTALLA */}

        <section
          id="seccion-pantalla"
          className="detalle-seccion"
        >

          <div className="detalle-titulo-con-estado">

            <div>

              <span>
                PANTALLA
              </span>

              <h2>
                Puesta de pantalla
              </h2>

              <p>
                Información técnica de la pantalla LED.
              </p>

            </div>


            <span
              className={
                estadoPantalla.completa
                  ? "detalle-seccion-estado-ok"
                  : "detalle-seccion-estado-pendiente"
              }
            >
              {estadoPantalla.completa
                ? "✓ Información completa"
                : "⚠ Información incompleta"}
            </span>

          </div>


          <div className="detalle-info-grid">

            <div className="detalle-info-card">

              <span>
                Tipo de pantalla
              </span>

              <strong>
                {evento.tipoPantalla ||
                  "Pendiente"}
              </strong>

            </div>


            <div className="detalle-info-card">

              <span>
                Pitch
              </span>

              <strong>
                {evento.pitch ||
                  "Pendiente"}
              </strong>

            </div>


            <div className="detalle-info-card">

              <span>
                Medidas
              </span>

              <strong>
                {evento.medidasPantalla ||
                  "Pendiente"}
              </strong>

            </div>


            <div className="detalle-info-card">

              <span>
                Resolución
              </span>

              <strong>
                {evento.resolucion ||
                  "Pendiente"}
              </strong>

            </div>


            <div className="detalle-info-card">

              <span>
                Procesador
              </span>

              <strong>
                {evento.procesador ||
                  "Pendiente"}
              </strong>

            </div>


            <div className="detalle-info-card">

              <span>
                Módulos / Gabinetes
              </span>

              <strong>
                {evento.cantidadPantalla ||
                  "Pendiente"}
              </strong>

            </div>

          </div>


          <div className="detalle-observaciones">

            <span>
              OBSERVACIONES TÉCNICAS
            </span>

            <p>
              {evento.observacionesPantalla ||
                "No hay observaciones técnicas cargadas."}
            </p>

          </div>

        </section>


        {/* MATERIALES */}

        <section
          id="seccion-materiales"
          className="detalle-seccion"
        >

          <div className="detalle-titulo-con-estado">

            <div>

              <span>
                MATERIALES
              </span>

              <h2>
                Hoja de pedido
              </h2>

              <p>
                Materiales necesarios para la producción.
              </p>

            </div>


            <span
              className={
                estadoMateriales.completa
                  ? "detalle-seccion-estado-ok"
                  : "detalle-seccion-estado-pendiente"
              }
            >
              {estadoMateriales.completa
                ? "✓ Materiales cargados"
                : "⚠ Sin materiales"}
            </span>

          </div>


          {esEditor && (
<form
            className="detalle-form-material"
            onSubmit={agregarMaterial}
          >

            <input
              type="text"
              placeholder="Cantidad"
              value={cantidadMaterial}
              onChange={(e) =>
                setCantidadMaterial(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Material"
              value={nombreMaterial}
              onChange={(e) =>
                setNombreMaterial(
                  e.target.value
                )
              }
            />

            <button type="submit">
              Agregar
            </button>

          </form>
)}

<div className="detalle-materiales-progreso">

  <span>
    Material preparado
  </span>

  <strong>
    {materiales.filter(
      (material) => material.guardado
    ).length}{" "}
    /{" "}
    {materiales.length}
  </strong>

</div>

          <div className="detalle-lista">

            {materiales.length === 0 ? (

              <div className="detalle-vacio">
                No hay materiales cargados.
              </div>

            ) : (

              materiales.map(
                (material) => (

                  <div
                    className="detalle-lista-item"
                    key={material.id}
                  >

                    {materialEditando === material.id ? (

                      <form
                        className="detalle-edicion-item"
                        onSubmit={
                          guardarEdicionMaterial
                        }
                      >

                        <input
                          type="text"
                          placeholder="Cantidad"
                          value={
                            cantidadMaterialEditando
                          }
                          onChange={(e) =>
                            setCantidadMaterialEditando(
                              e.target.value
                            )
                          }
                        />


                        <input
                          type="text"
                          placeholder="Material"
                          value={
                            nombreMaterialEditando
                          }
                          onChange={(e) =>
                            setNombreMaterialEditando(
                              e.target.value
                            )
                          }
                        />


                        <div className="detalle-edicion-acciones">

                          <button
                            type="submit"
                            className="detalle-guardar-edicion"
                          >
                            Guardar
                          </button>


                          <button
                            type="button"
                            className="detalle-cancelar-edicion"
                            onClick={
                              cancelarEdicionMaterial
                            }
                          >
                            Cancelar
                          </button>

                        </div>

                      </form>

                    ) : (

                      <>

                        <div className="detalle-material-info">

  <label
  className="detalle-material-check"
  onClick={
    esEditor
      ? () => cambiarEstadoMaterial(material.id)
      : undefined
  }
  style={esEditor ? undefined : { cursor: "default" }}
>
<span
  className={`detalle-checkbox-visual ${
    material.guardado
      ? "marcado"
      : ""
  }`}
>
  {material.guardado && (
    <span className="detalle-checkbox-check"></span>
  )}
</span>

    <span className={
      material.guardado
        ? "material-guardado"
        : ""
    }>
      {material.nombre}
    </span>

  </label>

  <span>
    Cantidad:{" "}
    {material.cantidad}
  </span>

</div>

                        {esEditor && (
<div className="detalle-lista-acciones">

                          <button
                            type="button"
                            className="detalle-editar-item"
                            onClick={() =>
                              iniciarEdicionMaterial(
                                material
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="detalle-eliminar"
                            onClick={() =>
                              eliminarMaterial(
                                material.id
                              )
                            }
                          >
                            Eliminar
                          </button>

                        </div>
)}

                      </>

                    )}

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* PERSONAL */}

        <section
          id="seccion-personal"
          className="detalle-seccion"
        >

          <div className="detalle-titulo-con-estado">

            <div>

              <span>
                PERSONAL
              </span>

              <h2>
                Equipo asignado
              </h2>

              <p>
                Personas asignadas a la producción.
              </p>

            </div>


            <span
              className={
                estadoPersonal.completa
                  ? "detalle-seccion-estado-ok"
                  : "detalle-seccion-estado-pendiente"
              }
            >
              {estadoPersonal.completa
                ? "✓ Personal asignado"
                : "⚠ Sin personal"}
            </span>

          </div>


          {esEditor && (
<form
            className="detalle-form-personal"
            onSubmit={agregarPersona}
          >

            <input
              type="text"
              placeholder="Nombre"
              value={nombrePersona}
              onChange={(e) =>
                setNombrePersona(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Rol"
              value={rolPersona}
              onChange={(e) =>
                setRolPersona(
                  e.target.value
                )
              }
            />

            <button type="submit">
              Agregar
            </button>

          </form>
)}


          <div className="detalle-lista">

            {personal.length === 0 ? (

              <div className="detalle-vacio">
                No hay personal asignado.
              </div>

            ) : (

              personal.map(
                (persona) => (

                  <div
                    className="detalle-lista-item"
                    key={persona.id}
                  >

                    {personaEditando === persona.id ? (

                      <form
                        className="detalle-edicion-item"
                        onSubmit={
                          guardarEdicionPersona
                        }
                      >

                        <input
                          type="text"
                          placeholder="Nombre"
                          value={
                            nombrePersonaEditando
                          }
                          onChange={(e) =>
                            setNombrePersonaEditando(
                              e.target.value
                            )
                          }
                        />


                        <input
                          type="text"
                          placeholder="Rol"
                          value={
                            rolPersonaEditando
                          }
                          onChange={(e) =>
                            setRolPersonaEditando(
                              e.target.value
                            )
                          }
                        />


                        <div className="detalle-edicion-acciones">

                          <button
                            type="submit"
                            className="detalle-guardar-edicion"
                          >
                            Guardar
                          </button>


                          <button
                            type="button"
                            className="detalle-cancelar-edicion"
                            onClick={
                              cancelarEdicionPersona
                            }
                          >
                            Cancelar
                          </button>

                        </div>

                      </form>

                    ) : (

                      <>

                        <div>

                          <strong>
                            {persona.nombre}
                          </strong>

                          <span>
                            {persona.rol ||
                              "Sin rol definido"}
                          </span>

                        </div>


                        {esEditor && (
<div className="detalle-lista-acciones">

                          <button
                            type="button"
                            className="detalle-editar-item"
                            onClick={() =>
                              iniciarEdicionPersona(
                                persona
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="detalle-eliminar"
                            onClick={() =>
                              eliminarPersona(
                                persona.id
                              )
                            }
                          >
                            Eliminar
                          </button>

                        </div>
)}

                      </>

                    )}

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* CONSIDERACIONES */}

        <section
          id="seccion-consideraciones"
          className="detalle-seccion"
        >

          <div className="detalle-seccion-titulo">

            <span>
              CONSIDERACIONES
            </span>

            <h2>
              Cosas a tener en cuenta
            </h2>

            <p>
              Información importante para la producción.
            </p>

          </div>


          <div className="detalle-consideraciones">

            <div className="detalle-consideracion">

              <span>
                Lugar
              </span>

              <strong>
                {evento.lugar ||
                  "Sin definir"}
              </strong>

            </div>


            <div className="detalle-consideracion">

              <span>
                Contacto
              </span>

              <strong>
                {evento.contacto ||
                  "Sin definir"}
              </strong>

            </div>


            <div className="detalle-consideracion detalle-consideracion-completa">

              <span>
                Observaciones
              </span>

              <p>
                {evento.consideraciones ||
                  "No hay consideraciones cargadas."}
              </p>

            </div>

          </div>

        </section>


        {/* POST EVENTO */}

        <section
          id="seccion-postevento"
          className="detalle-seccion"
        >

          <div className="detalle-seccion-titulo">

            <span>
              POST-EVENTO
            </span>

            <h2>
              Balance de la producción
            </h2>

            <p>
              Registrar problemas y aspectos positivos.
            </p>

          </div>


          <div className="detalle-postevento-grid">

            <div className="detalle-postevento-card">

              <label>
                Problemas / cosas a mejorar
              </label>

              <textarea
                readOnly={!esEditor}
                value={problemasPostEvento}
                onChange={(e) =>
                  setProblemasPostEvento(
                    e.target.value
                  )
                }
                placeholder="Registrar problemas, errores o cosas a mejorar..."
              />

            </div>


            <div className="detalle-postevento-card">

              <label>
                Cosas positivas
              </label>

              <textarea
                readOnly={!esEditor}
                value={positivosPostEvento}
                onChange={(e) =>
                  setPositivosPostEvento(
                    e.target.value
                  )
                }
                placeholder="Registrar lo que salió bien..."
              />

            </div>

          </div>


          {esEditor && (
<button
            className="detalle-guardar-postevento"
            onClick={guardarPostEvento}
            disabled={guardandoPostEvento}
          >
            {guardandoPostEvento
              ? "Guardando..."
              : "Guardar balance"}
          </button>
)}

        </section>

      </main>

    </div>
  )
}

export default EventoDetalle