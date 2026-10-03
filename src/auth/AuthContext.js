import { createContext, useContext } from "react"

// Contexto de autenticación. El proveedor está en AuthProvider.jsx
export const AuthContext = createContext(null)

export function useAuth() {

  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      "useAuth tiene que usarse dentro de <AuthProvider>"
    )
  }

  return contexto
}
