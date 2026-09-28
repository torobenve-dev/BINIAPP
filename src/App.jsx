import { supabase } from "./supabaseClient"
import { useEffect, useState } from "react"
import "./App.css"

import Dashboard from "./components/Dashboard"
import CalculadoraHoras from "./components/CalculadoraHoras"
import Eventos from "./components/Eventos"
import EventoDetalle from "./components/EventoDetalle"
import CalendarioEventos from "./components/CalendarioEventos"

import Sidebar from "./Sidebar"
import SidebarUsuario from "./SidebarUsuario"


function App() {

  useEffect(() => {
  async function probarSupabase() {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .limit(1)

    console.log("SUPABASE DATA:", data)
    console.log("SUPABASE ERROR:", error)
  }

  probarSupabase()
}, [])
 
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

    const eventosGuardados =
      localStorage.getItem("eventos")

    if (eventosGuardados) {
      setEventos(
        JSON.parse(eventosGuardados)
      )
    }

  }, [pantalla])


  function abrirDetalleEvento(
    evento,
    seccion = "seccion-resumen"
  ) {

    setEventoSeleccionado(evento)

    setSeccionEventoInicial(seccion)

    setPantalla("detalle-evento")
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