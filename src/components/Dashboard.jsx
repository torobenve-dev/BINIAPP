import { useEffect, useState } from "react"
import CalendarioEventos from "./CalendarioEventos"
import { cargarEventos } from "../services/eventosService"

function Dashboard({
  abrirCalculadora,
  abrirEventos,
  abrirEvento
}) {
  const [eventos, setEventos] = useState([])
  const [errorCarga, setErrorCarga] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const lista = await cargarEventos()

        if (!cancelado) {
          setEventos(lista)
        }
      } catch (error) {
        console.error(
          "ERROR AL CARGAR EVENTOS:",
          error
        )

        if (!cancelado) {
          setErrorCarga(true)
        }
      }
    }

    cargar()

    return () => {
      cancelado = true
    }
  }, [])

  function obtenerClaseActividad(tipo) {
    if (tipo === "Armado") {
      return "dashboard-actividad-armado"
    }

    if (tipo === "Evento") {
      return "dashboard-actividad-evento"
    }

    if (tipo === "Desarme") {
      return "dashboard-actividad-desarme"
    }

    return ""
  }

  function formatearFecha(fecha) {
    if (!fecha) {
      return ""
    }

    const partes = fecha.split("-")

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  function obtenerFechaEvento(evento) {
    return evento.fechaInicio || evento.fecha
  }

  function obtenerActividadesDeHoy(eventos) {
    const hoy = new Date()

    const año = hoy.getFullYear()
    const mes = String(
      hoy.getMonth() + 1
    ).padStart(2, "0")
    const dia = String(
      hoy.getDate()
    ).padStart(2, "0")

    const fechaHoy =
      `${año}-${mes}-${dia}`

    const actividades = []

    eventos.forEach((evento) => {

      if (evento.fechaArmado === fechaHoy) {
        actividades.push({
          id: `${evento.id}-armado`,
          tipo: "Armado",
          evento
        })
      }

      if (
        obtenerFechaEvento(evento) ===
        fechaHoy
      ) {
        actividades.push({
          id: `${evento.id}-evento`,
          tipo: "Evento",
          evento
        })
      }

      if (evento.fechaDesarme === fechaHoy) {
        actividades.push({
          id: `${evento.id}-desarme`,
          tipo: "Desarme",
          evento
        })
      }

    })

    return actividades
  }

  function obtenerEventosProximos(eventos) {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    return eventos
      .filter((evento) => {
        const fecha = obtenerFechaEvento(evento)

        if (!fecha) {
          return false
        }

        const partes = fecha.split("-")

        const fechaEvento =
          new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
          )

        return fechaEvento >= hoy
      })
      .sort((a, b) =>
        obtenerFechaEvento(a).localeCompare(
          obtenerFechaEvento(b)
        )
      )
      .slice(0, 5)
  }

  function obtenerProblemasEvento(evento) {
  const problemas = []

  if (!evento.fechaArmado) {
    problemas.push({
      texto: "Falta fecha de armado",
      seccion: "seccion-resumen"
    })
  }

  if (
    !evento.tipoPantalla ||
    !evento.pitch ||
    !evento.medidasPantalla
  ) {
    problemas.push({
      texto: "Falta información de pantalla",
      seccion: "seccion-pantalla"
    })
  }

  if (
    !evento.personal ||
    evento.personal.length === 0
  ) {
    problemas.push({
      texto: "No hay personal asignado",
      seccion: "seccion-personal"
    })
  }

  if (
    !evento.materiales ||
    evento.materiales.length === 0
  ) {
    problemas.push({
      texto: "No hay materiales cargados",
      seccion: "seccion-materiales"
    })
  }

  return problemas
}
  const actividadesHoy =
    obtenerActividadesDeHoy(eventos)

  const eventosProximos =
    obtenerEventosProximos(eventos)

  const eventosConProblemas =
    eventos
      .map((evento) => ({
        evento,
        problemas:
          obtenerProblemasEvento(evento)
      }))
      .filter(
        (item) =>
          item.problemas.length > 0
      )

  return (
    <div className="app dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <span className="sidebar-logo-principal">
  BINIVISION
</span>

          <h1>
            Bini App
          </h1>

          <p>
            Gestión de eventos y producción
          </p>
        </div>

      </header>


      {errorCarga && (
        <div className="dashboard-vacio">
          No se pudieron cargar los eventos.
        </div>
      )}

      {/* ACTIVIDAD DE HOY */}

      <section className="dashboard-seccion">

        <div className="dashboard-seccion-titulo">

          <div>
            <span>HOY</span>
            <h2>
              Actividad de producción
            </h2>
          </div>

        </div>

        {actividadesHoy.length === 0 ? (

          <div className="dashboard-vacio">
            No hay actividades programadas
            para hoy.
          </div>

        ) : (

          <div className="dashboard-actividades">

            {actividadesHoy.map(
              (actividad) => (

                <button
                  className={`dashboard-actividad ${obtenerClaseActividad(
                    actividad.tipo
                  )}`}
                  key={actividad.id}
                  onClick={() =>
                    abrirEvento(
                      actividad.evento
                    )
                  }
                >

                  <span>
                    {actividad.tipo ===
                      "Armado" && "🔧"}

                    {actividad.tipo ===
                      "Evento" && "🎤"}

                    {actividad.tipo ===
                      "Desarme" && "📦"}
                  </span>

                  <div>

                    <strong>
                      {actividad.tipo}
                    </strong>

                    <p>
                      {actividad.evento.nombre}
                    </p>

                  </div>

                </button>

              )
            )}

          </div>

        )}

      </section>


      {/* EVENTOS PRÓXIMOS */}

      <section className="dashboard-seccion">

        <div className="dashboard-seccion-titulo">

          <div>
            <span>PRÓXIMOS</span>

            <h2>
              Próximos eventos
            </h2>
          </div>

          <button
            className="dashboard-ver-todos"
            onClick={abrirEventos}
          >
            Ver todos →
          </button>

        </div>

        {eventosProximos.length === 0 ? (

          <div className="dashboard-vacio">
            No hay eventos próximos.
          </div>

        ) : (

          <div className="dashboard-proximos">

            {eventosProximos.map(
              (evento) => (

                <button
                  className="dashboard-proximo"
                  key={evento.id}
                  onClick={() =>
                    abrirEvento(evento)
                  }
                >

                  <div>
                    <strong>
                      {evento.nombre}
                    </strong>

                    <span>
                      📍 {evento.lugar}
                    </span>
                  </div>

                  <strong>
                    {formatearFecha(
                      obtenerFechaEvento(
                        evento
                      )
                    )}
                  </strong>

                </button>

              )
            )}

          </div>

        )}

      </section>
      


      {/* REQUIEREN ATENCIÓN */}

      <section className="dashboard-seccion">

        <div className="dashboard-seccion-titulo">

          <div>
            <span>REVISAR</span>

            <h2>
              Eventos que requieren atención
            </h2>
          </div>

          <strong className="dashboard-contador-atencion">
            {eventosConProblemas.length}
          </strong>

        </div>

        {eventosConProblemas.length === 0 ? (

          <div className="dashboard-atencion-ok">

            <span>✓</span>

            <div>
              <strong>
                Todo en orden
              </strong>

              <p>
                No hay eventos con información
                pendiente.
              </p>
            </div>

          </div>

        ) : (

          <div className="dashboard-atencion-lista">

            {eventosConProblemas.map(
              ({
                evento,
                problemas
              }) => (

                <button
                  className="dashboard-atencion"
                  key={evento.id}
                 onClick={() =>
  abrirEvento(
    evento,
    problemas[0].seccion
  )
}
                >

                  <div className="dashboard-atencion-icono">
                    !
                  </div>

                  <div className="dashboard-atencion-info">

                    <strong>
                      {evento.nombre}
                    </strong>

                    <span>
                      {evento.lugar}
                    </span>

                    <p>
  {problemas.length}{" "}
  {problemas.length === 1
    ? "dato pendiente"
    : "datos pendientes"}
</p>

<div className="dashboard-atencion-problemas">

  {problemas.map((problema) => (
    <span key={problema.seccion}>
      • {problema.texto}
    </span>
  ))}

</div>

                  </div>

                  <span className="dashboard-atencion-flecha">
                    →
                  </span>

                </button>

              )
            )}

          </div>

        )}

      </section>


      {/* MÓDULOS */}

      <section className="dashboard-seccion">

        <div className="dashboard-seccion-titulo">

          <div>
            <span>BINI APP</span>

            <h2>
              Herramientas
            </h2>
          </div>

        </div>

        <div className="dashboard-modulos">

          <button
            className="dashboard-modulo"
            onClick={abrirCalculadora}
          >
            <span>⏱</span>

            <div>
              <strong>
                Calculadora de horas
              </strong>

              <p>
                Cálculo de jornadas y horas extra.
              </p>
            </div>
          </button>

          <button
            className="dashboard-modulo"
            onClick={abrirEventos}
          >
            <span>📅</span>

            <div>
              <strong>
                Eventos
              </strong>

              <p>
                Gestión y planificación de eventos.
              </p>
            </div>
          </button>

          <div className="dashboard-modulo dashboard-modulo-futuro">
            <span>📦</span>

            <div>
              <strong>
                Inventario
              </strong>

              <p>
                Próximamente.
              </p>
            </div>
          </div>

          <div className="dashboard-modulo dashboard-modulo-futuro">
            <span>📊</span>

            <div>
              <strong>
                Reportes
              </strong>

              <p>
                Próximamente.
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard