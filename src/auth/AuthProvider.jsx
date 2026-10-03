import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"

import { supabase } from "../supabaseClient"
import { AuthContext } from "./AuthContext"


// Si el usuario llegó desde el enlace de "olvidé mi contraseña",
// Supabase deja type=recovery en la URL.
function llegoDesdeRecuperacion() {
  return window.location.hash.includes("type=recovery")
}


export function AuthProvider({ children }) {

  const [sesion, setSesion] =
    useState(null)

  const [perfil, setPerfil] =
    useState(null)

  const [cargando, setCargando] =
    useState(true)

  const [errorPerfil, setErrorPerfil] =
    useState("")

  const [recuperandoClave, setRecuperandoClave] =
    useState(llegoDesdeRecuperacion)

  const usuarioId = sesion?.user?.id


  // =========================================================
  // SESIÓN
  // =========================================================

  useEffect(() => {

    let activo = true

    supabase.auth.getSession().then(({ data }) => {

      if (!activo) {
        return
      }

      setSesion(data.session)

      if (!data.session) {
        setCargando(false)
      }
    })

    // OJO: dentro de este callback no se hacen consultas a la
    // base (puede trabar el cliente de Supabase). El perfil se
    // carga en el efecto de más abajo.
    const { data: suscripcion } =
      supabase.auth.onAuthStateChange(
        (evento, nuevaSesion) => {

          if (evento === "PASSWORD_RECOVERY") {
            setRecuperandoClave(true)
          }

          setSesion(nuevaSesion)

          if (!nuevaSesion) {
            setPerfil(null)
            setCargando(false)
          }
        }
      )

    return () => {
      activo = false
      suscripcion.subscription.unsubscribe()
    }

  }, [])


  // =========================================================
  // PERFIL (nombre y rol)
  // =========================================================

  useEffect(() => {

    if (!usuarioId) {
      return
    }

    let activo = true

    async function cargarPerfil() {

      setCargando(true)
      setErrorPerfil("")

      const { data, error } = await supabase
        .from("perfiles")
        .select("nombre, rol")
        .eq("id", usuarioId)
        .maybeSingle()

      if (!activo) {
        return
      }

      if (error) {

        console.error(
          "ERROR AL CARGAR EL PERFIL:",
          error
        )

        setErrorPerfil(
          "No se pudo cargar tu perfil."
        )

        setPerfil(null)

      } else {

        setPerfil(data)
      }

      setCargando(false)
    }

    cargarPerfil()

    return () => {
      activo = false
    }

  }, [usuarioId])


  // =========================================================
  // ACCIONES
  // =========================================================

  const iniciarSesion = useCallback(
    async (email, clave) => {

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: clave
        })

      if (error) {
        throw error
      }
    },
    []
  )

  const cerrarSesion = useCallback(
    async () => {

      const { error } =
        await supabase.auth.signOut()

      if (error) {
        console.error(
          "ERROR AL CERRAR SESIÓN:",
          error
        )
      }
    },
    []
  )

  const enviarRecuperacion = useCallback(
    async (email) => {

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: window.location.origin }
        )

      if (error) {
        throw error
      }
    },
    []
  )

  const cambiarClave = useCallback(
    async (nuevaClave) => {

      const { error } =
        await supabase.auth.updateUser({
          password: nuevaClave
        })

      if (error) {
        throw error
      }

      // limpia #type=recovery de la dirección
      window.history.replaceState(
        null,
        "",
        window.location.pathname
      )

      setRecuperandoClave(false)
    },
    []
  )


  const cancelarRecuperacion = useCallback(
    async () => {

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      )

      setRecuperandoClave(false)

      await supabase.auth.signOut()
    },
    []
  )


  const valor = useMemo(
    () => ({
      sesion,
      usuario: sesion?.user ?? null,
      perfil,
      // Sin perfil = sin permisos de edición (lo más seguro).
      esEditor: perfil?.rol === "editor",
      cargando,
      errorPerfil,
      recuperandoClave,
      iniciarSesion,
      cerrarSesion,
      enviarRecuperacion,
      cambiarClave,
      cancelarRecuperacion
    }),
    [
      sesion,
      perfil,
      cargando,
      errorPerfil,
      recuperandoClave,
      iniciarSesion,
      cerrarSesion,
      enviarRecuperacion,
      cambiarClave,
      cancelarRecuperacion
    ]
  )

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}
