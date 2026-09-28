import { useMemo, useState } from "react"

function CalendarioEventos({ eventos, abrirEvento }) {
  const hoy = new Date()

  const [mesActual, setMesActual] =
    useState(hoy.getMonth())

  const [añoActual, setAñoActual] =
    useState(hoy.getFullYear())

  const [diaExpandido, setDiaExpandido] =
    useState(null)

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ]

  const nombresDias = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom"
  ]

  function cambiarMes(cantidad) {
    let nuevoMes = mesActual + cantidad
    let nuevoAño = añoActual

    if (nuevoMes < 0) {
      nuevoMes = 11
      nuevoAño--
    }

    if (nuevoMes > 11) {
      nuevoMes = 0
      nuevoAño++
    }

    setMesActual(nuevoMes)
    setAñoActual(nuevoAño)
    setDiaExpandido(null)
  }

  function volverAlMesActual() {
    setMesActual(hoy.getMonth())
    setAñoActual(hoy.getFullYear())
    setDiaExpandido(null)
  }

  function obtenerDiasDelMes() {
    const primerDia =
      new Date(
        añoActual,
        mesActual,
        1
      )

    const ultimoDia =
      new Date(
        añoActual,
        mesActual + 1,
        0
      )

    let diaSemana =
      primerDia.getDay()

    diaSemana =
      diaSemana === 0
        ? 6
        : diaSemana - 1

    const dias = []

    for (let i = 0; i < diaSemana; i++) {
      dias.push(null)
    }

    for (
      let dia = 1;
      dia <= ultimoDia.getDate();
      dia++
    ) {
      dias.push(dia)
    }

    return dias
  }

  function formatearFechaCalendario(
    año,
    mes,
    dia
  ) {
    const mesTexto =
      String(mes + 1).padStart(2, "0")

    const diaTexto =
      String(dia).padStart(2, "0")

    return `${año}-${mesTexto}-${diaTexto}`
  }

  function obtenerActividadesDelDia(dia) {
    if (!dia) {
      return []
    }

    const fecha =
      formatearFechaCalendario(
        añoActual,
        mesActual,
        dia
      )

    const actividades = []

    eventos.forEach((evento) => {
      const inicio =
        evento.fechaInicio ||
        evento.fecha

      const fin =
        evento.fechaFin ||
        evento.fechaInicio ||
        evento.fecha

      if (!inicio) {
        return
      }

      // ARMADO
      if (
        evento.fechaArmado === fecha
      ) {
        actividades.push({
          id: `${evento.id}-armado`,
          evento,
          tipo: "armado",
          titulo: "Armado",
          icono: "🔧"
        })
      }

      // EVENTO
      if (
        fecha >= inicio &&
        fecha <= fin
      ) {
        actividades.push({
          id: `${evento.id}-evento`,
          evento,
          tipo: "evento",
          titulo: "Evento",
          icono: "🎤"
        })
      }

      // DESARME
      if (
        evento.fechaDesarme === fecha
      ) {
        actividades.push({
          id: `${evento.id}-desarme`,
          evento,
          tipo: "desarme",
          titulo: "Desarme",
          icono: "📦"
        })
      }
    })

    return actividades
  }

  function esHoy(dia) {
    if (!dia) {
      return false
    }

    return (
      dia === hoy.getDate() &&
      mesActual === hoy.getMonth() &&
      añoActual === hoy.getFullYear()
    )
  }

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

  function obtenerClaseActividad(tipo) {
    if (tipo === "armado") {
      return "actividad-armado"
    }

    if (tipo === "desarme") {
      return "actividad-desarme"
    }

    return "actividad-evento"
  }

  const dias = useMemo(
    () => obtenerDiasDelMes(),
    [
      mesActual,
      añoActual,
      eventos
    ]
  )

  return (
    <div className="tarjeta-modulo calendario">

      <div className="calendario-cabecera">

        <button
          className="boton-editar"
          onClick={() =>
            cambiarMes(-1)
          }
        >
          ←
        </button>

        <div>
          <h2>
            {nombresMeses[mesActual]}{" "}
            {añoActual}
          </h2>
        </div>

        <button
          className="boton-editar"
          onClick={() =>
            cambiarMes(1)
          }
        >
          →
        </button>

      </div>

      <button
        className="boton-volver calendario-hoy"
        onClick={volverAlMesActual}
      >
        Ir a hoy
      </button>

      <div className="calendario-referencias">

        <span>
          🔧 Armado
        </span>

        <span>
          🎤 Evento
        </span>

        <span>
          📦 Desarme
        </span>

      </div>

      <div className="calendario-grid">

        {nombresDias.map((dia) => (
          <div
            className="calendario-dia-semana"
            key={dia}
          >
            {dia}
          </div>
        ))}

        {dias.map((dia, indice) => {

          const actividades =
            obtenerActividadesDelDia(
              dia
            )

          const expandido =
            diaExpandido === dia

          const actividadesVisibles =
            expandido
              ? actividades
              : actividades.slice(0, 3)

          const cantidadOculta =
            actividades.length - 3

          return (
            <div
              className={`calendario-dia ${
                esHoy(dia)
                  ? "calendario-dia-hoy"
                  : ""
              }`}
              key={indice}
            >

              {dia && (
                <>
                  <div className="numero-dia">
                    {dia}
                  </div>

                  <div className="eventos-dia">

                    {actividadesVisibles.map(
                      (actividad) => {

                        const estado =
                          actividad.evento
                            .estado ||
                          "Confirmado"

                        return (
                          <button
                            key={actividad.id}
                            className={`evento-calendario ${obtenerClaseEstado(
                              estado
                            )} ${obtenerClaseActividad(
                              actividad.tipo
                            )}`}
                            onClick={() =>
                              abrirEvento(
                                actividad.evento
                              )
                            }
                          >

                            <span>
                              {actividad.icono}
                            </span>

                            <span>
                              {actividad.evento.nombre}
                            </span>

                          </button>
                        )
                      }
                    )}

                    {cantidadOculta > 0 && (
                      <button
                        className="eventos-mas"
                        onClick={() =>
                          setDiaExpandido(
                            expandido
                              ? null
                              : dia
                          )
                        }
                      >
                        {expandido
                          ? "Mostrar menos"
                          : `+ ${cantidadOculta} actividades`}
                      </button>
                    )}

                  </div>
                </>
              )}

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default CalendarioEventos