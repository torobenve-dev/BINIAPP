import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useAuth } from "../auth/AuthContext"
import {
  cargarEventos as cargarEventosDeSupabase,
  mapearEvento
} from "../services/eventosService"
import CalendarioEventos from "./CalendarioEventos"

function Eventos({
  volverAlInicio,
  abrirEvento,
  eventoParaEditar,
  terminarEdicion,
  eventoGuardado
}) {

  const { esEditor } = useAuth()
  const [eventos, setEventos] = useState([])

  // =========================
  // INFORMACIÓN GENERAL
  // =========================

  const [nombre, setNombre] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const [fechaArmado, setFechaArmado] = useState("")
  const [horaArmado, setHoraArmado] = useState("")

  const [fechaDesarme, setFechaDesarme] = useState("")
  const [horaDesarme, setHoraDesarme] = useState("")

  const [lugar, setLugar] = useState("")
  const [tipo, setTipo] = useState("")
  const [contacto, setContacto] = useState("")
  const [consideraciones, setConsideraciones] =
    useState("")

  // =========================
  // PUESTA DE PANTALLA
  // =========================

  const [tipoPantalla, setTipoPantalla] =
    useState("")

  const [pitch, setPitch] = useState("")

  const [medidasPantalla, setMedidasPantalla] =
    useState("")

  const [resolucion, setResolucion] =
    useState("")

  const [procesador, setProcesador] =
    useState("")

  const [cantidadPantalla, setCantidadPantalla] =
    useState("")

  const [
    observacionesPantalla,
    setObservacionesPantalla
  ] = useState("")

  const [
    consideracionesPantalla,
    setConsideracionesPantalla
  ] = useState("")

  // =========================
  // PUESTA DE AUDIO
  // =========================

  const [sistemaAudio, setSistemaAudio] =
    useState("")

  const [consolaAudio, setConsolaAudio] =
    useState("")

  const [microfonosAudio, setMicrofonosAudio] =
    useState("")

  const [monitoresAudio, setMonitoresAudio] =
    useState("")

  const [otrosAudio, setOtrosAudio] =
    useState("")

  const [
    consideracionesAudio,
    setConsideracionesAudio
  ] = useState("")

  // =========================
  // PUESTA DE LUCES
  // =========================

  const [consolaLuces, setConsolaLuces] =
    useState("")

  const [fixturesLuces, setFixturesLuces] =
    useState("")

  const [cantidadLuces, setCantidadLuces] =
    useState("")

  const [estructuraLuces, setEstructuraLuces] =
    useState("")

  const [otrosLuces, setOtrosLuces] =
    useState("")

  const [
    consideracionesLuces,
    setConsideracionesLuces
  ] = useState("")

  // =========================
  // CONTROL DEL FORMULARIO
  // =========================

  const [eventoEditando, setEventoEditando] =
    useState(null)

  const [error, setError] = useState("")

  const [filtroEstado, setFiltroEstado] =
    useState("Todos")

  // =========================
  // ACORDEONES
  // =========================

  const [pantallaAbierta, setPantallaAbierta] =
    useState(false)

  const [audioAbierto, setAudioAbierto] =
    useState(false)

  const [lucesAbiertas, setLucesAbiertas] =
    useState(false)

  // =========================
  // CARGAR EVENTOS DESDE SUPABASE
  // =========================

  useEffect(() => {
    async function cargar() {
      try {
        setEventos(await cargarEventosDeSupabase())
      } catch (error) {
        console.error(
          "ERROR AL CARGAR EVENTOS:",
          error
        )

        setError(
          "No se pudieron cargar los eventos."
        )
      }
    }

    cargar()
  }, [])

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  function limpiarFormulario() {
    setNombre("")
    setFechaInicio("")
    setFechaFin("")

    setFechaArmado("")
    setHoraArmado("")

    setFechaDesarme("")
    setHoraDesarme("")

    setLugar("")
    setTipo("")
    setContacto("")
    setConsideraciones("")

    // Pantalla
    setTipoPantalla("")
    setPitch("")
    setMedidasPantalla("")
    setResolucion("")
    setProcesador("")
    setCantidadPantalla("")
    setObservacionesPantalla("")
    setConsideracionesPantalla("")

    // Audio
    setSistemaAudio("")
    setConsolaAudio("")
    setMicrofonosAudio("")
    setMonitoresAudio("")
    setOtrosAudio("")
    setConsideracionesAudio("")

    // Luces
    setConsolaLuces("")
    setFixturesLuces("")
    setCantidadLuces("")
    setEstructuraLuces("")
    setOtrosLuces("")
    setConsideracionesLuces("")

    setEventoEditando(null)
    setError("")

    setPantallaAbierta(false)
    setAudioAbierto(false)
    setLucesAbiertas(false)
  }

  // =========================
  // GUARDAR EVENTO
  // =========================

  async function guardarEvento() {
    setError("")

    if (
      !nombre ||
      !fechaInicio ||
      !fechaFin ||
      !fechaArmado ||
      !horaArmado ||
      !fechaDesarme ||
      !horaDesarme ||
      !lugar ||
      !tipo
    ) {
      setError(
        "Completá todos los campos obligatorios."
      )

      return
    }

    if (fechaFin < fechaInicio) {
      setError(
        "La fecha de finalización no puede ser anterior a la fecha de inicio."
      )

      return
    }

    if (fechaDesarme < fechaArmado) {
      setError(
        "La fecha de desarme no puede ser anterior a la fecha de armado."
      )

      return
    }

    // =========================
    // DATOS TÉCNICOS
    // =========================

    const datosEvento = {
      tipo,
      consideraciones,

      // Pantalla
      tipoPantalla,
      pitch,
      medidasPantalla,
      resolucion,
      procesador,
      cantidadPantalla,
      observacionesPantalla,
      consideracionesPantalla,

      // Audio
      sistemaAudio,
      consolaAudio,
      microfonosAudio,
      monitoresAudio,
      otrosAudio,
      consideracionesAudio,

      // Luces
      consolaLuces,
      fixturesLuces,
      cantidadLuces,
      estructuraLuces,
      otrosLuces,
      consideracionesLuces
    }

    // =========================
    // EDITAR EVENTO
    // =========================

    if (eventoEditando) {
      const { data, error } = await supabase
        .from("eventos")
        .update({
          nombre,

          lugar,

          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,

          fecha_armado: fechaArmado,
          hora_armado: horaArmado,

          fecha_desarme: fechaDesarme,
          hora_desarme: horaDesarme,

          contacto,

          datos: datosEvento
        })
        .eq("id", eventoEditando)
        .select()
        .single()

      if (error) {
        console.error(
          "ERROR AL EDITAR EVENTO EN SUPABASE:",
          error
        )

        setError(
          "No se pudieron guardar los cambios."
        )

        return
      }

      const eventoActualizado = {
        ...eventos.find(
          (evento) =>
            evento.id === eventoEditando
        ),
        ...mapearEvento(data)
      }

      const eventosActualizados =
        eventos.map((evento) =>
          evento.id === eventoEditando
            ? eventoActualizado
            : evento
        )

      setEventos(eventosActualizados)


      limpiarFormulario()

      if (eventoGuardado) {
        eventoGuardado(eventoActualizado)
      }

      return
    }

    // =========================
    // CREAR EVENTO EN SUPABASE
    // =========================

    const { data, error } = await supabase
      .from("eventos")
      .insert({
        nombre,

        lugar,

        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,

        fecha_armado: fechaArmado,
        hora_armado: horaArmado,

        fecha_desarme: fechaDesarme,
        hora_desarme: horaDesarme,

        contacto,

        estado: "Confirmado",

        datos: datosEvento
      })
      .select()
      .single()

    if (error) {
      console.error(
        "ERROR AL CREAR EVENTO EN SUPABASE:",
        error
      )

      setError(
        "No se pudo guardar el evento. Revisá la conexión."
      )

      return
    }

    const nuevoEvento = {
      ...mapearEvento(data),
      materiales: [],
      personal: []
    }

    const eventosActualizados = [
      ...eventos,
      nuevoEvento
    ]

    setEventos(eventosActualizados)


    limpiarFormulario()

    if (eventoGuardado) {
      eventoGuardado(nuevoEvento)
    }
  }

  // =========================
  // EDITAR EVENTO
  // =========================

  function editarEvento(evento) {
    setNombre(evento.nombre)

    setFechaInicio(
      evento.fechaInicio ||
        evento.fecha ||
        ""
    )

    setFechaFin(
      evento.fechaFin ||
        evento.fechaInicio ||
        evento.fecha ||
        ""
    )

    setFechaArmado(
      evento.fechaArmado || ""
    )

    setHoraArmado(
      evento.horaArmado || ""
    )

    setFechaDesarme(
      evento.fechaDesarme || ""
    )

    setHoraDesarme(
      evento.horaDesarme || ""
    )

    setLugar(evento.lugar || "")
    setTipo(evento.tipo || "")
    setContacto(evento.contacto || "")

    setConsideraciones(
      evento.consideraciones || ""
    )

    // Pantalla
    setTipoPantalla(
      evento.tipoPantalla || ""
    )

    setPitch(evento.pitch || "")

    setMedidasPantalla(
      evento.medidasPantalla || ""
    )

    setResolucion(
      evento.resolucion || ""
    )

    setProcesador(
      evento.procesador || ""
    )

    setCantidadPantalla(
      evento.cantidadPantalla || ""
    )

    setObservacionesPantalla(
      evento.observacionesPantalla || ""
    )

    setConsideracionesPantalla(
      evento.consideracionesPantalla || ""
    )

    // Audio
    setSistemaAudio(
      evento.sistemaAudio || ""
    )

    setConsolaAudio(
      evento.consolaAudio || ""
    )

    setMicrofonosAudio(
      evento.microfonosAudio || ""
    )

    setMonitoresAudio(
      evento.monitoresAudio || ""
    )

    setOtrosAudio(
      evento.otrosAudio || ""
    )

    setConsideracionesAudio(
      evento.consideracionesAudio || ""
    )

    // Luces
    setConsolaLuces(
      evento.consolaLuces || ""
    )

    setFixturesLuces(
      evento.fixturesLuces || ""
    )

    setCantidadLuces(
      evento.cantidadLuces || ""
    )

    setEstructuraLuces(
      evento.estructuraLuces || ""
    )

    setOtrosLuces(
      evento.otrosLuces || ""
    )

    setConsideracionesLuces(
      evento.consideracionesLuces || ""
    )

    setPantallaAbierta(
      Boolean(
        evento.tipoPantalla ||
        evento.pitch ||
        evento.medidasPantalla ||
        evento.resolucion ||
        evento.procesador ||
        evento.cantidadPantalla ||
        evento.observacionesPantalla ||
        evento.consideracionesPantalla
      )
    )

    setAudioAbierto(
      Boolean(
        evento.sistemaAudio ||
        evento.consolaAudio ||
        evento.microfonosAudio ||
        evento.monitoresAudio ||
        evento.otrosAudio ||
        evento.consideracionesAudio
      )
    )

    setLucesAbiertas(
      Boolean(
        evento.consolaLuces ||
        evento.fixturesLuces ||
        evento.cantidadLuces ||
        evento.estructuraLuces ||
        evento.otrosLuces ||
        evento.consideracionesLuces
      )
    )

    setEventoEditando(evento.id)
    setError("")

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    if (!eventoParaEditar) {
      return
    }

    editarEvento(eventoParaEditar)

    if (terminarEdicion) {
      terminarEdicion()
    }
  }, [eventoParaEditar])

  // =========================
  // ELIMINAR EVENTO
  // =========================

  async function eliminarEvento(id) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este evento?"
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(
        "ERROR AL ELIMINAR EVENTO EN SUPABASE:",
        error
      )

      setError(
        "No se pudo eliminar el evento."
      )

      return
    }

    const eventosActualizados =
      eventos.filter(
        (evento) => evento.id !== id
      )

    setEventos(eventosActualizados)


    if (eventoEditando === id) {
      limpiarFormulario()
    }
  }

  // =========================
  // FORMATEAR FECHA
  // =========================

  function formatearFecha(fecha) {
    if (!fecha) {
      return ""
    }

    const partes = fecha.split("-")

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  // =========================
  // ESTADO
  // =========================

  function obtenerClaseEstado(estado) {
    if (estado === "En armado") {
      return "estado-en-armado"
    }

    if (estado === "En operación") {
      return "estado-en-operacion"
    }

    if (estado === "Finalizado") {
      return "estado-finalizado"
    }

    return "estado-confirmado"
  }

  const eventosFiltrados =
    filtroEstado === "Todos"
      ? eventos
      : eventos.filter(
          (evento) =>
            (evento.estado ||
              "Confirmado") ===
            filtroEstado
        )

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app">

      <button
        className="boton-volver"
        onClick={volverAlInicio}
      >
        ← Volver al inicio
      </button>

      <div className="encabezado">

        <h1>
          BINIVISION
        </h1>

        <p>
          Eventos
        </p>

      </div>

      {esEditor && (
      <div className="formulario">

        {eventoEditando && (
          <div className="modo-edicion">
            Editando evento
          </div>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <h2>
          Información general
        </h2>

        {/* =========================
            INFORMACIÓN GENERAL
        ========================= */}

        <div className="campo">

          <label>
            Nombre del evento
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(evento) =>
              setNombre(
                evento.target.value
              )
            }
            placeholder="Ej: Cosquín Rock"
          />

        </div>

        <div className="campo">

          <label>
            Fecha de inicio
          </label>

          <input
            type="date"
            value={fechaInicio}
            onChange={(evento) =>
              setFechaInicio(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Fecha de finalización
          </label>

          <input
            type="date"
            value={fechaFin}
            onChange={(evento) =>
              setFechaFin(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Fecha de armado
          </label>

          <input
            type="date"
            value={fechaArmado}
            onChange={(evento) =>
              setFechaArmado(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Hora de armado
          </label>

          <input
            type="time"
            value={horaArmado}
            onChange={(evento) =>
              setHoraArmado(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Fecha de desarme
          </label>

          <input
            type="date"
            value={fechaDesarme}
            onChange={(evento) =>
              setFechaDesarme(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Hora de desarme
          </label>

          <input
            type="time"
            value={horaDesarme}
            onChange={(evento) =>
              setHoraDesarme(
                evento.target.value
              )
            }
          />

        </div>

        <div className="campo">

          <label>
            Lugar
          </label>

          <input
            type="text"
            value={lugar}
            onChange={(evento) =>
              setLugar(
                evento.target.value
              )
            }
            placeholder="Ej: Predio Ferial Córdoba"
          />

        </div>

        <div className="campo">

          <label>
            Tipo de trabajo
          </label>

          <input
            type="text"
            value={tipo}
            onChange={(evento) =>
              setTipo(
                evento.target.value
              )
            }
            placeholder="Ej: Pantalla LED"
          />

        </div>

        <div className="campo">

          <label>
            Contacto del evento
          </label>

          <input
            type="text"
            value={contacto}
            onChange={(evento) =>
              setContacto(
                evento.target.value
              )
            }
            placeholder="Ej: Juan Pérez - 351 123 4567"
          />

        </div>

        {/* =========================
            PUESTAS TÉCNICAS
        ========================= */}

        <div className="puestas-tecnicas">

          <div className="puestas-titulo">
            Puestas técnicas
          </div>

          {/* =========================
              PANTALLA
          ========================= */}

          <div
            className={`puesta-card ${
              pantallaAbierta
                ? "puesta-card-abierta"
                : ""
            }`}
          >

            <button
              type="button"
              className="puesta-header"
              onClick={() =>
                setPantallaAbierta(
                  !pantallaAbierta
                )
              }
            >

              <span className="puesta-icono">
                🖥️
              </span>

              <span className="puesta-nombre">
                Puesta de pantalla
              </span>

              <span className="puesta-flecha">
                {pantallaAbierta
                  ? "⌃"
                  : "⌄"}
              </span>

            </button>

            {pantallaAbierta && (
              <div className="puesta-contenido">

                <div className="campo">

                  <label>
                    Tipo de pantalla
                  </label>

                  <input
                    type="text"
                    value={tipoPantalla}
                    onChange={(evento) =>
                      setTipoPantalla(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: P3.9"
                  />

                </div>

                <div className="campo">

                  <label>
                    Pitch
                  </label>

                  <input
                    type="text"
                    value={pitch}
                    onChange={(evento) =>
                      setPitch(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 3.9 mm"
                  />

                </div>

                <div className="campo">

                  <label>
                    Medidas de pantalla
                  </label>

                  <input
                    type="text"
                    value={medidasPantalla}
                    onChange={(evento) =>
                      setMedidasPantalla(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 6 x 3 metros"
                  />

                </div>

                <div className="campo">

                  <label>
                    Resolución
                  </label>

                  <input
                    type="text"
                    value={resolucion}
                    onChange={(evento) =>
                      setResolucion(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 1536 x 768"
                  />

                </div>

                <div className="campo">

                  <label>
                    Procesador
                  </label>

                  <input
                    type="text"
                    value={procesador}
                    onChange={(evento) =>
                      setProcesador(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: NovaStar VX1000"
                  />

                </div>

                <div className="campo">

                  <label>
                    Módulos / Gabinetes
                  </label>

                  <input
                    type="text"
                    value={cantidadPantalla}
                    onChange={(evento) =>
                      setCantidadPantalla(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 120 gabinetes"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Observaciones técnicas
                  </label>

                  <textarea
                    value={observacionesPantalla}
                    onChange={(evento) =>
                      setObservacionesPantalla(
                        evento.target.value
                      )
                    }
                    placeholder="Información técnica importante..."
                    rows="3"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Consideraciones
                  </label>

                  <textarea
                    value={consideracionesPantalla}
                    onChange={(evento) =>
                      setConsideracionesPantalla(
                        evento.target.value
                      )
                    }
                    placeholder="Todo lo que haya que tener en cuenta para la puesta de pantalla..."
                    rows="3"
                  />

                </div>

              </div>
            )}

          </div>

          {/* =========================
              AUDIO
          ========================= */}

          <div
            className={`puesta-card ${
              audioAbierto
                ? "puesta-card-abierta"
                : ""
            }`}
          >

            <button
              type="button"
              className="puesta-header"
              onClick={() =>
                setAudioAbierto(
                  !audioAbierto
                )
              }
            >

              <span className="puesta-icono">
                🔊
              </span>

              <span className="puesta-nombre">
                Puesta de audio
              </span>

              <span className="puesta-flecha">
                {audioAbierto
                  ? "⌃"
                  : "⌄"}
              </span>

            </button>

            {audioAbierto && (
              <div className="puesta-contenido">

                <div className="campo">

                  <label>
                    Sistema de audio
                  </label>

                  <input
                    type="text"
                    value={sistemaAudio}
                    onChange={(evento) =>
                      setSistemaAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: Line Array"
                  />

                </div>

                <div className="campo">

                  <label>
                    Consola
                  </label>

                  <input
                    type="text"
                    value={consolaAudio}
                    onChange={(evento) =>
                      setConsolaAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: Yamaha QL5"
                  />

                </div>

                <div className="campo">

                  <label>
                    Micrófonos
                  </label>

                  <input
                    type="text"
                    value={microfonosAudio}
                    onChange={(evento) =>
                      setMicrofonosAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 4 inalámbricos + 2 vincha"
                  />

                </div>

                <div className="campo">

                  <label>
                    Monitores
                  </label>

                  <input
                    type="text"
                    value={monitoresAudio}
                    onChange={(evento) =>
                      setMonitoresAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 4 wedges"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Otros
                  </label>

                  <textarea
                    value={otrosAudio}
                    onChange={(evento) =>
                      setOtrosAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Información adicional de audio..."
                    rows="3"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Consideraciones
                  </label>

                  <textarea
                    value={consideracionesAudio}
                    onChange={(evento) =>
                      setConsideracionesAudio(
                        evento.target.value
                      )
                    }
                    placeholder="Todo lo que haya que tener en cuenta para la puesta de audio..."
                    rows="3"
                  />

                </div>

              </div>
            )}

          </div>

          {/* =========================
              LUCES
          ========================= */}

          <div
            className={`puesta-card ${
              lucesAbiertas
                ? "puesta-card-abierta"
                : ""
            }`}
          >

            <button
              type="button"
              className="puesta-header"
              onClick={() =>
                setLucesAbiertas(
                  !lucesAbiertas
                )
              }
            >

              <span className="puesta-icono">
                💡
              </span>

              <span className="puesta-nombre">
                Puesta de luces
              </span>

              <span className="puesta-flecha">
                {lucesAbiertas
                  ? "⌃"
                  : "⌄"}
              </span>

            </button>

            {lucesAbiertas && (
              <div className="puesta-contenido">

                <div className="campo">

                  <label>
                    Consola
                  </label>

                  <input
                    type="text"
                    value={consolaLuces}
                    onChange={(evento) =>
                      setConsolaLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: MA2 Command Wing"
                  />

                </div>

                <div className="campo">

                  <label>
                    Fixtures
                  </label>

                  <input
                    type="text"
                    value={fixturesLuces}
                    onChange={(evento) =>
                      setFixturesLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: Mac Aura, PAR, Wash..."
                  />

                </div>

                <div className="campo">

                  <label>
                    Cantidad
                  </label>

                  <input
                    type="text"
                    value={cantidadLuces}
                    onChange={(evento) =>
                      setCantidadLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 12 Wash + 8 PAR"
                  />

                </div>

                <div className="campo">

                  <label>
                    Estructura
                  </label>

                  <input
                    type="text"
                    value={estructuraLuces}
                    onChange={(evento) =>
                      setEstructuraLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Ej: 2 trusses de 6 m"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Otros
                  </label>

                  <textarea
                    value={otrosLuces}
                    onChange={(evento) =>
                      setOtrosLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Información adicional de iluminación..."
                    rows="3"
                  />

                </div>

                <div className="campo campo-ancho-completo">

                  <label>
                    Consideraciones
                  </label>

                  <textarea
                    value={consideracionesLuces}
                    onChange={(evento) =>
                      setConsideracionesLuces(
                        evento.target.value
                      )
                    }
                    placeholder="Todo lo que haya que tener en cuenta para la puesta de luces..."
                    rows="3"
                  />

                </div>

              </div>
            )}

          </div>

        </div>

        {/* =========================
            CONSIDERACIONES GENERALES
        ========================= */}

        <h2>
          Consideraciones generales
        </h2>

        <div className="campo campo-ancho-completo">

          <textarea
            value={consideraciones}
            onChange={(evento) =>
              setConsideraciones(
                evento.target.value
              )
            }
            placeholder="Todo lo que haya que tener en cuenta sobre el evento en general..."
            rows="4"
          />

        </div>

        {/* =========================
            BOTONES
        ========================= */}

        <button
          className="boton-principal"
          onClick={guardarEvento}
        >
          {eventoEditando
            ? "Guardar cambios"
            : "Crear evento"}
        </button>

        {eventoEditando && (
          <button
            className="boton-cancelar"
            onClick={limpiarFormulario}
          >
            Cancelar edición
          </button>
        )}

      </div>
      )}

      {/* =========================
          CALENDARIO
      ========================= */}

      <CalendarioEventos
        eventos={eventos}
        abrirEvento={abrirEvento}
      />

      {/* =========================
          LISTA DE EVENTOS
      ========================= */}

      <h2>
        Eventos
      </h2>

      <div className="filtro-mes">

        <label>

          Filtrar por estado

          <select
            value={filtroEstado}
            onChange={(evento) =>
              setFiltroEstado(
                evento.target.value
              )
            }
          >

            <option value="Todos">
              Todos
            </option>

            <option value="Confirmado">
              Confirmados
            </option>

            <option value="En armado">
              En armado
            </option>

            <option value="En operación">
              En operación
            </option>

            <option value="Finalizado">
              Finalizados
            </option>

          </select>

        </label>

      </div>

      {eventosFiltrados.length === 0 && (
        <div className="tarjeta-modulo">

          <p>
            No hay eventos que coincidan con este filtro.
          </p>

        </div>
      )}

      {eventosFiltrados.map((evento) => {

        const estado =
          evento.estado ||
          "Confirmado"

        return (
          <div
            className="jornada"
            key={evento.id}
          >

            <div className="jornada-cabecera">

              <div>

                <p className="jornada-fecha">
                  {evento.nombre}
                </p>

                <span className="jornada-tipo">
                  {evento.tipo}
                </span>

                <span
                  className={`estado-evento ${obtenerClaseEstado(
                    estado
                  )}`}
                >
                  {estado}
                </span>

              </div>

              <div className="jornada-horario">

                {evento.fechaInicio
                  ? `Del ${formatearFecha(
                      evento.fechaInicio
                    )} al ${formatearFecha(
                      evento.fechaFin
                    )}`
                  : formatearFecha(
                      evento.fecha
                    )}

              </div>

            </div>

            <div className="jornada-datos">

              <div>

                <span>
                  Lugar
                </span>

                <strong>
                  {evento.lugar}
                </strong>

              </div>

            </div>

            <div className="botones-jornada">

              {esEditor && (
<button
                className="boton-editar"
                onClick={() =>
                  editarEvento(evento)
                }
              >
                Editar
              </button>
)}

              {esEditor && (
<button
                className="boton-eliminar"
                onClick={() =>
                  eliminarEvento(
                    evento.id
                  )
                }
              >
                Eliminar
              </button>
)}

              <button
                className="boton-principal"
                onClick={() =>
                  abrirEvento(evento)
                }
              >
                Abrir evento
              </button>

            </div>

          </div>
        )
      })}

    </div>
  )
}

export default Eventos