import { useState } from "react"

import { useAuth } from "../auth/AuthContext"

import "./Login.css"


function traducirError(error) {

  const mensaje =
    (error?.message || "").toLowerCase()

  if (mensaje.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos."
  }

  if (mensaje.includes("email not confirmed")) {
    return "Tu cuenta todavía no está activada. Pedile al administrador que la active."
  }

  if (
    mensaje.includes("rate limit") ||
    error?.status === 429
  ) {
    return "Demasiados intentos. Esperá unos minutos y probá de nuevo."
  }

  if (
    mensaje.includes("failed to fetch") ||
    mensaje.includes("network")
  ) {
    return "No se pudo conectar. Revisá tu conexión a internet."
  }

  return "No se pudo completar la operación. Probá de nuevo."
}


function Login() {

  const { iniciarSesion, enviarRecuperacion } =
    useAuth()

  const [modo, setModo] =
    useState("ingresar")

  const [email, setEmail] =
    useState("")

  const [clave, setClave] =
    useState("")

  const [enviando, setEnviando] =
    useState(false)

  const [error, setError] =
    useState("")

  const [aviso, setAviso] =
    useState("")


  function cambiarModo(nuevoModo) {
    setModo(nuevoModo)
    setError("")
    setAviso("")
  }


  async function enviarFormulario(e) {

    e.preventDefault()

    setError("")
    setAviso("")

    if (!email.trim()) {
      setError("Ingresá tu email.")
      return
    }

    if (modo === "ingresar" && !clave) {
      setError("Ingresá tu contraseña.")
      return
    }

    setEnviando(true)

    try {

      if (modo === "ingresar") {

        await iniciarSesion(email, clave)

      } else {

        await enviarRecuperacion(email)

        setAviso(
          "Si el email está registrado, te enviamos un enlace para cambiar la contraseña."
        )
      }

    } catch (err) {

      console.error("ERROR DE ACCESO:", err)

      setError(traducirError(err))

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
          {modo === "ingresar"
            ? "Iniciar sesión"
            : "Recuperar contraseña"}
        </h1>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {aviso && (
          <p className="auth-aviso">
            {aviso}
          </p>
        )}

        <form onSubmit={enviarFormulario}>

          <div className="auth-campo">

            <label htmlFor="auth-email">
              Email
            </label>

            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {modo === "ingresar" && (
            <div className="auth-campo">

              <label htmlFor="auth-clave">
                Contraseña
              </label>

              <input
                id="auth-clave"
                type="password"
                autoComplete="current-password"
                value={clave}
                onChange={(e) =>
                  setClave(e.target.value)
                }
              />

            </div>
          )}

          <button
            type="submit"
            className="auth-boton"
            disabled={enviando}
          >
            {enviando
              ? "Un momento..."
              : modo === "ingresar"
                ? "Ingresar"
                : "Enviar enlace"}
          </button>

        </form>

        <button
          type="button"
          className="auth-enlace"
          onClick={() =>
            cambiarModo(
              modo === "ingresar"
                ? "recuperar"
                : "ingresar"
            )
          }
        >
          {modo === "ingresar"
            ? "Olvidé mi contraseña"
            : "Volver a iniciar sesión"}
        </button>

      </div>

    </div>
  )
}

export default Login
