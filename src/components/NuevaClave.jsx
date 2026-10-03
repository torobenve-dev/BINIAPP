import { useState } from "react"

import { useAuth } from "../auth/AuthContext"

import "./Login.css"


const LARGO_MINIMO = 8


function NuevaClave() {

  const { cambiarClave, cancelarRecuperacion } =
    useAuth()

  const [nueva, setNueva] =
    useState("")

  const [repetida, setRepetida] =
    useState("")

  const [enviando, setEnviando] =
    useState(false)

  const [error, setError] =
    useState("")


  async function enviarFormulario(e) {

    e.preventDefault()

    setError("")

    if (nueva.length < LARGO_MINIMO) {
      setError(
        `La contraseña tiene que tener al menos ${LARGO_MINIMO} caracteres.`
      )
      return
    }

    if (nueva !== repetida) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setEnviando(true)

    try {

      await cambiarClave(nueva)

    } catch (err) {

      console.error(
        "ERROR AL CAMBIAR LA CONTRASEÑA:",
        err
      )

      setError(
        "No se pudo cambiar la contraseña. Si el enlace venció, pedí uno nuevo."
      )

    } finally {

      setEnviando(false)
    }
  }


  return (
    <div className="auth-pantalla">

      <div className="auth-tarjeta">

        <div className="auth-logo">
          BINIVISION
        </div>

        <div className="auth-subtitulo">
          BINI APP
        </div>

        <h1 className="auth-titulo">
          Elegí tu nueva contraseña
        </h1>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <form onSubmit={enviarFormulario}>

          <div className="auth-campo">

            <label htmlFor="auth-nueva">
              Nueva contraseña
            </label>

            <input
              id="auth-nueva"
              type="password"
              autoComplete="new-password"
              value={nueva}
              onChange={(e) =>
                setNueva(e.target.value)
              }
            />

          </div>

          <div className="auth-campo">

            <label htmlFor="auth-repetida">
              Repetir contraseña
            </label>

            <input
              id="auth-repetida"
              type="password"
              autoComplete="new-password"
              value={repetida}
              onChange={(e) =>
                setRepetida(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="auth-boton"
            disabled={enviando}
          >
            {enviando
              ? "Guardando..."
              : "Guardar contraseña"}
          </button>

        </form>

        <button
          type="button"
          className="auth-enlace"
          onClick={cancelarRecuperacion}
        >
          Cancelar
        </button>

      </div>

    </div>
  )
}

export default NuevaClave
