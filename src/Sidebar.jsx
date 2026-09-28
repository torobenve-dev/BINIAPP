function IconoInicio() {
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
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}


function IconoEventos() {
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
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
    </svg>
  )
}


function IconoHoras() {
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
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}


function IconoMateriales() {
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
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </svg>
  )
}


function IconoPersonal() {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c.7-4 3.1-6 7-6s6.3 2 7 6" />
    </svg>
  )
}


function IconoLogistica() {
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
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  )
}


function Sidebar({ pantalla, cambiarPantalla }) {

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="sidebar-logo-principal">
          BINIVISION
        </div>

        <div className="sidebar-logo-subtitulo">
          BINI APP
        </div>

      </div>


      <nav className="sidebar-nav">

        <button
          className={`sidebar-item ${
            pantalla === "dashboard"
              ? "sidebar-item-activo"
              : ""
          }`}
          onClick={() => cambiarPantalla("dashboard")}
        >
          <span className="sidebar-icono">
            <IconoInicio />
          </span>

          <span>Inicio</span>
        </button>


        <button
          className={`sidebar-item ${
            pantalla === "eventos"
              ? "sidebar-item-activo"
              : ""
          }`}
          onClick={() => cambiarPantalla("eventos")}
        >
          <span className="sidebar-icono">
            <IconoEventos />
          </span>

          <span>Eventos</span>
        </button>


        <button
          className={`sidebar-item ${
            pantalla === "calculadora"
              ? "sidebar-item-activo"
              : ""
          }`}
          onClick={() => cambiarPantalla("calculadora")}
        >
          <span className="sidebar-icono">
            <IconoHoras />
          </span>

          <span>Horas</span>
        </button>

      </nav>


      <div className="sidebar-separador" />

      <div className="sidebar-titulo">
        PRÓXIMAMENTE
      </div>


      <div className="sidebar-item sidebar-item-bloqueado">
        <span className="sidebar-icono">
          <IconoMateriales />
        </span>

        <span>Materiales</span>
      </div>


      <div className="sidebar-item sidebar-item-bloqueado">
        <span className="sidebar-icono">
          <IconoPersonal />
        </span>

        <span>Personal</span>
      </div>


      <div className="sidebar-item sidebar-item-bloqueado">
        <span className="sidebar-icono">
          <IconoLogistica />
        </span>

        <span>Logística</span>
      </div>


      <div className="sidebar-footer">

        <div className="sidebar-footer-linea" />

        <div className="sidebar-footer-texto">
          BINI APP
        </div>

        <div className="sidebar-footer-version">
  Versión 0.1
</div>

<div className="sidebar-footer-developer">
  Developed by Joaquín Benvenuto
</div>

      </div>

    </aside>
  )
}

export default Sidebar