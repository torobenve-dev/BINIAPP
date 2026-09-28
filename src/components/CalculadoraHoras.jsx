import { useState, useEffect } from "react"

function CalculadoraHoras({ volverAlInicio }) {
  const [entrada, setEntrada] = useState("")
  const [salida, setSalida] = useState("")
  const [tipo, setTipo] = useState("fijo")
  const [fecha, setFecha] = useState("")
  const [mesSeleccionado, setMesSeleccionado] = useState("")
  const [error, setError] = useState("")

  const [jornadas, setJornadas] = useState(() => {
    const jornadasGuardadas = localStorage.getItem("jornadas")

    return jornadasGuardadas
      ? JSON.parse(jornadasGuardadas)
      : []
  })

  const [jornadaEditando, setJornadaEditando] = useState(null)

  useEffect(() => {
    localStorage.setItem(
      "jornadas",
      JSON.stringify(jornadas)
    )
  }, [jornadas])

  function convertirAMinutos(hora) {
    const [horas, minutos] = hora.split(":")

    return Number(horas) * 60 + Number(minutos)
  }

  function mostrarHoras(minutos) {
    const horas = Math.floor(minutos / 60)
    const minutosRestantes = minutos % 60

    return `${horas} h ${minutosRestantes} min`
  }

  function mostrarFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-")

    return `${dia}/${mes}/${anio}`
  }

  function mostrarMes(mes) {
    const [anio, numeroMes] = mes.split("-")

    const fecha = new Date(
      Number(anio),
      Number(numeroMes) - 1
    )

    return fecha.toLocaleDateString(
      "es-AR",
      {
        month: "long",
        year: "numeric"
      }
    )
  }

  function calcularHorasExtra(
    fecha,
    entrada,
    salida,
    tipo
  ) {
    if (tipo === "eventual") {
      return 0
    }

    const minutosEntrada =
      convertirAMinutos(entrada)

    const minutosSalida =
      convertirAMinutos(salida)

    const dia = new Date(
      `${fecha}T12:00:00`
    ).getDay()

    const esFinDeSemana =
      dia === 0 || dia === 6

    const horasTotales =
      minutosSalida - minutosEntrada

    if (esFinDeSemana) {
      return horasTotales
    }

    const inicioHorarioNormal = 9 * 60
    const finHorarioNormal = 18 * 60

    const inicioNormal = Math.max(
      minutosEntrada,
      inicioHorarioNormal
    )

    const finNormal = Math.min(
      minutosSalida,
      finHorarioNormal
    )

    let horasNormales = 0

    if (finNormal > inicioNormal) {
      horasNormales =
        finNormal - inicioNormal
    }

    return horasTotales - horasNormales
  }

  function agregarJornada() {
    setError("")

    if (!fecha) {
      setError(
        "Tenés que seleccionar una fecha."
      )
      return
    }

    if (!entrada) {
      setError(
        "Tenés que indicar la hora de entrada."
      )
      return
    }

    if (!salida) {
      setError(
        "Tenés que indicar la hora de salida."
      )
      return
    }

    const minutosEntrada =
      convertirAMinutos(entrada)

    const minutosSalida =
      convertirAMinutos(salida)

    if (
      minutosSalida <= minutosEntrada
    ) {
      setError(
        "La hora de salida debe ser posterior a la hora de entrada."
      )
      return
    }

    const horasTotalesCalculadas =
      minutosSalida - minutosEntrada

    const horasExtraCalculadas =
      calcularHorasExtra(
        fecha,
        entrada,
        salida,
        tipo
      )

    if (jornadaEditando !== null) {
      const jornadasActualizadas =
        jornadas.map((jornada) => {
          if (
            jornada.id === jornadaEditando
          ) {
            return {
              ...jornada,
              fecha: fecha,
              entrada: entrada,
              salida: salida,
              tipo: tipo,
              horasTotales:
                horasTotalesCalculadas,
              horasExtra:
                horasExtraCalculadas
            }
          }

          return jornada
        })

      setJornadas(jornadasActualizadas)
      setJornadaEditando(null)

      return
    }

    const nuevaJornada = {
      id: Date.now(),
      fecha: fecha,
      entrada: entrada,
      salida: salida,
      tipo: tipo,
      horasTotales:
        horasTotalesCalculadas,
      horasExtra:
        horasExtraCalculadas
    }

    setJornadas([
      ...jornadas,
      nuevaJornada
    ])
  }

  function eliminarJornada(id) {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar esta jornada?"
    )

    if (!confirmar) {
      return
    }

    const jornadasActualizadas =
      jornadas.filter(
        (jornada) =>
          jornada.id !== id
      )

    setJornadas(
      jornadasActualizadas
    )
  }

  function editarJornada(id) {
    const jornada =
      jornadas.find(
        (jornada) =>
          jornada.id === id
      )

    setFecha(jornada.fecha)
    setEntrada(jornada.entrada)
    setSalida(jornada.salida)
    setTipo(jornada.tipo)
    setError("")

    setJornadaEditando(id)
  }

  const jornadasOrdenadas = [...jornadas].sort(
    (a, b) =>
      new Date(b.fecha) - new Date(a.fecha)
  )

  const jornadasDelMes =
    jornadas.filter((jornada) => {
      if (!mesSeleccionado) {
        return true
      }

      return jornada.fecha.startsWith(
        mesSeleccionado
      )
    })

  const horasDelMes =
    jornadasDelMes.reduce(
      (total, jornada) =>
        total + jornada.horasTotales,
      0
    )

  const horasExtraDelMes =
    jornadasDelMes.reduce(
      (total, jornada) =>
        total + jornada.horasExtra,
      0
    )

  const cantidadJornadasDelMes =
    jornadasDelMes.length

  let horasTotales = 0
  let horasExtra = 0

  if (entrada && salida) {
    const minutosEntrada =
      convertirAMinutos(entrada)

    const minutosSalida =
      convertirAMinutos(salida)

    horasTotales =
      minutosSalida - minutosEntrada

    horasExtra =
      calcularHorasExtra(
        fecha,
        entrada,
        salida,
        tipo
      )
  }

  return (
    <div className="app">

      <button
  className="boton-volver"
  onClick={volverAlInicio}
>
  ← VOLVER AL INICIO
</button>

      <div className="encabezado">
        <h1>BINIVISION</h1>
        <p>Calculadora de horas</p>
      </div>

      <div className="formulario">

        {jornadaEditando !== null && (
          <div className="modo-edicion">
            Editando jornada
          </div>
        )}

        <div className="campo">
          <label>
            Tipo de trabajador
          </label>

          <select
            value={tipo}
            onChange={(evento) =>
              setTipo(
                evento.target.value
              )
            }
          >
            <option value="fijo">
              Fijo
            </option>

            <option value="eventual">
              Eventual
            </option>
          </select>
        </div>

        <div className="campo">
          <label>
            Fecha
          </label>

          <input
            type="date"
            value={fecha}
            onChange={(evento) =>
              setFecha(
                evento.target.value
              )
            }
          />
        </div>

        <div className="campo">
          <label>
            Hora de entrada
          </label>

          <input
            type="time"
            value={entrada}
            onChange={(evento) =>
              setEntrada(
                evento.target.value
              )
            }
          />
        </div>

        <div className="campo">
          <label>
            Hora de salida
          </label>

          <input
            type="time"
            value={salida}
            onChange={(evento) =>
              setSalida(
                evento.target.value
              )
            }
          />
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          className="boton-principal"
          onClick={agregarJornada}
        >
          {jornadaEditando !== null
            ? "Guardar cambios"
            : "Agregar jornada"}
        </button>

        {jornadaEditando !== null && (
          <button
            className="boton-cancelar"
            onClick={() => {
              setJornadaEditando(null)
              setFecha("")
              setEntrada("")
              setSalida("")
              setTipo("fijo")
              setError("")
            }}
          >
            Cancelar edición
          </button>
        )}

      </div>

      <h2>Horas de la jornada</h2>

      <div className="resumen resumen-jornada">

        <div className="tarjeta-resumen">
          <h3>Horas trabajadas</h3>

          <p>
            {mostrarHoras(
              horasTotales
            )}
          </p>
        </div>

        {tipo === "fijo" && (
          <div className="tarjeta-resumen">
            <h3>Horas extra</h3>

            <p>
              {mostrarHoras(
                horasExtra
              )}
            </p>
          </div>
        )}

      </div>

      <h2>Jornadas</h2>

      {jornadasOrdenadas.map((jornada) => (
        <div
          className="jornada"
          key={jornada.id}
        >

          <div className="jornada-cabecera">

            <div>
              <p className="jornada-fecha">
                {mostrarFecha(
                  jornada.fecha
                )}
              </p>

              <span className="jornada-tipo">
                {jornada.tipo}
              </span>
            </div>

            <div className="jornada-horario">
              {jornada.entrada} → {jornada.salida}
            </div>

          </div>

          <div className="jornada-datos">

            <div>
              <span>Horas trabajadas</span>

              <strong>
                {mostrarHoras(
                  jornada.horasTotales
                )}
              </strong>
            </div>

            {jornada.tipo === "fijo" && (
              <div>
                <span>Horas extra</span>

                <strong>
                  {mostrarHoras(
                    jornada.horasExtra
                  )}
                </strong>
              </div>
            )}

          </div>

          <div className="botones-jornada">

            <button
              className="boton-editar"
              onClick={() =>
                editarJornada(
                  jornada.id
                )
              }
            >
              Editar
            </button>

            <button
              className="boton-eliminar"
              onClick={() =>
                eliminarJornada(
                  jornada.id
                )
              }
            >
              Eliminar
            </button>

          </div>

        </div>
      ))}

      <h2>Resumen del mes</h2>

      <div className="filtro-mes">

        <label>
          Mes a consultar

          <input
            type="month"
            value={mesSeleccionado}
            onChange={(evento) =>
              setMesSeleccionado(
                evento.target.value
              )
            }
          />
        </label>

      </div>

      <div className="periodo-resumen">
        {mesSeleccionado
          ? `Resumen de ${mostrarMes(mesSeleccionado)}`
          : "Resumen de todas las jornadas"}
      </div>

      <div className="resumen">

        <div className="tarjeta-resumen">
          <h3>Jornadas</h3>

          <p>
            {cantidadJornadasDelMes}
          </p>
        </div>

        <div className="tarjeta-resumen">
          <h3>Horas trabajadas</h3>

          <p>
            {mostrarHoras(
              horasDelMes
            )}
          </p>
        </div>

        <div className="tarjeta-resumen">
          <h3>Horas extra</h3>

          <p>
            {mostrarHoras(
              horasExtraDelMes
            )}
          </p>
        </div>

      </div>

    </div>
  )
}

export default CalculadoraHoras