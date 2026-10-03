import { cargarEventos } from "./services/eventosService"
import { useAuth } from "./auth/AuthContext"
import { useEffect, useState } from "react"
import "./App.css"

import Dashboard from "./components/Dashboard"
import CalculadoraHoras from "./components/CalculadoraHoras"
import Eventos from "./components/Eventos"
import EventoDetalle from "./components/EventoDetalle"
import CalendarioEventos from "./components/CalendarioEventos"
import Login from "./components/Login"
import NuevaClave from "./components/NuevaClave"

import Sidebar from "./Sidebar"
import SidebarUsuario from "./SidebarUsuario"


function App() {

  const { sesion, cargando, recuperandoClave } =
    useAuth()

  const usuarioId = sesion?.user?.id

  const [pantalla, setPantalla] =
    useState("dashboard")


  const [eventoSeleccionado, setEventoSeleccionado] =
    useState(null)


  const [eventoParaEditar, setEventoParaEditar] =
    useState(null)


  const [seccionEventoInicial, setSeccionEventoInicial] =
    useState("seccion-resumen")


  const [eventos, setEventos] =
    useState([])


  useEffect(() => {

    if (!usuarioId) {
      return
    }

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
      }
    }

    cargar()

    return () => {
      cancelado = true
    }

  }, [pantalla, usuarioId])


  // Al cerrar sesión se limpia todo lo que había en pantalla.
  useEffect(() => {

    if (!sesion) {
      setPantalla("dashboard")
      setEventoSeleccionado(null)
      setEventoParaEditar(null)
      setEventos([])
    }

  }, [sesion])


  function abrirDetalleEvento(
    evento,
    seccion = "seccion-resumen"
  ) {

    setEventoSeleccionado(evento)

    setSeccionEventoInicial(seccion)

    setPantalla("detalle-evento")
  }


  if (cargando) {
    return (
      <div className="auth-pantalla">
        <p className="auth-cargando">
          Cargando...
        </p>
      </div>
    )
  }

  if (recuperandoClave) {
    return <NuevaClave />
  }

  if (!sesion) {
    return <Login />
  }


  return (
    <div className="app-layout">

      <Sidebar
        pantalla={pantalla}
        cambiarPantalla={setPantalla}
      />


      <main className="app-contenido">


        {pantalla === "dashboard" && (

          <Dashboard
            abrirCalculadora={() =>
              setPantalla("calculadora")
            }

            abrirEventos={() =>
              setPantalla("eventos")
            }

            abrirEvento={abrirDetalleEvento}
          />

        )}


        {pantalla === "calculadora" && (

          <CalculadoraHoras
            volverAlInicio={() =>
              setPantalla("dashboard")
            }
          />

        )}


        {pantalla === "eventos" && (

          <Eventos
            volverAlInicio={() =>
              setPantalla("dashboard")
            }

            abrirEvento={abrirDetalleEvento}

            eventoParaEditar={
              eventoParaEditar
            }

            terminarEdicion={() =>
              setEventoParaEditar(null)
            }

            eventoGuardado={(evento) => {
              abrirDetalleEvento(evento)
            }}
          />

        )}


        {pantalla === "detalle-evento" && (

          <EventoDetalle
            evento={eventoSeleccionado}

            seccionInicial={
              seccionEventoInicial
            }

            volver={() =>
              setPantalla("eventos")
            }

            editarEvento={(evento) => {

              setEventoParaEditar(evento)

              setPantalla("eventos")

            }}
          />

        )}


        {pantalla === "calendario" && (

          <CalendarioEventos
            eventos={eventos}
            abrirEvento={abrirDetalleEvento}
          />

        )}

      </main>


      <SidebarUsuario
        pantalla={pantalla}
        cambiarPantalla={setPantalla}
      />

    </div>
  )
}


export default App