import { useAuth } from "./auth/AuthContext"


function IconoCalendario() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M7.5 3v4" />
      <path d="M16.5 3v4" />
      <path d="M3.5 9.5h17" />
    </svg>
  )
}


function IconoNotificaciones() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}


function IconoConfiguracion() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 18l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.8a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 9.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2.4v.7a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.7V15h-.7a1.7 1.7 0 0 0-1.6 0Z" />
    </svg>
  )
}


function IconoSalir() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}


function SidebarUsuario({
  pantalla,
  cambiarPantalla
}) {

  const { usuario, perfil, esEditor, cerrarSesion } =
    useAuth()

  const email = usuario?.email || ""

  const nombre =
    perfil?.nombre ||
    email.split("@")[0] ||
    "Usuario"

  const inicial =
    nombre.charAt(0).toUpperCase()

  return (
    <aside className="sidebar-usuario">

      <div className="sidebar-usuario-perfil">

        <div className="sidebar-usuario-avatar">
          {inicial}
        </div>

        <div>
          <strong
            title={email}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {nombre}
          </strong>

          <span>
            {esEditor ? "Editor" : "Solo lectura"}
          </span>
        </div>

      </div>


      <div className="sidebar-usuario-separador" />


      <nav className="sidebar-usuario-nav">

        <button
          className={`sidebar-usuario-item ${
            pantalla === "calendario"
              ? "sidebar-usuario-item-activo"
              : ""
          }`}
          onClick={() =>
            cambiarPantalla("calendario")
          }
        >

          <span className="sidebar-usuario-icono">
            <IconoCalendario />
          </span>

          <span>
            Calendario
          </span>

        </button>


        <button
          className="sidebar-usuario-item"
          onClick={() => {}}
        >

          <span className="sidebar-usuario-icono">
            <IconoNotificaciones />
          </span>

          <span>
            Notificaciones
          </span>

        </button>

      </nav>


      <div className="sidebar-usuario-separador" />


      <button
        className="sidebar-usuario-item"
        onClick={() => {}}
      >

        <span className="sidebar-usuario-icono">
          <IconoConfiguracion />
        </span>

        <span>
          Configuración
        </span>

      </button>


      <button
        className="sidebar-usuario-item"
        onClick={cerrarSesion}
      >

        <span className="sidebar-usuario-icono">
          <IconoSalir />
        </span>

        <span>
          Cerrar sesión
        </span>

      </button>

    </aside>
  )
}

export default SidebarUsuario