

import React from "react"
import { useAuthContext } from "../context/AuthContext"
import { Navigate } from 'react-router'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated, loading } = useAuthContext()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    children
  )
}

export default ProtectedRoute