

import { Link, useNavigate } from "react-router"
import { useAuthContext } from "../context/AuthContext"
import { useLogin } from "../hooks/useAuth"
import React, { useState } from "react"
import { toast } from 'react-toastify'

const LoginPage = () => {

  const navigate = useNavigate()

  const { checkAuth } = useAuthContext()

  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      await loginMutation.mutateAsync(formData)
      toast.success("Login Successful")
      await checkAuth();
      navigate("/")

    } catch (error) {
      console.log(error)
      toast.error("Login Failed Please try again")
    }
  }

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center mt-21">
      <h1 className="font-bold mb-6 text-2xl text-center"
        style={{ fontFamily: 'LEMONMILK' }}
      >Log In Your Account</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4"
      >
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({
            ...formData,
            password: e.target.value
          })}
        />

        <button className="btn btn-primary w-full">
          Login
        </button>

        <div className="">
          Did not have an Account?
          <Link to="/register" className="link text-sm ml-2 text-primary">
            Signup here
          </Link>
        </div>

        <div className="">
          Forgot Your Password?
          <Link to="/forgot-password" className="link text-sm ml-2 text-primary">
            Change your password here
          </Link>
        </div>


      </form>

    </div>

  )
}

export default LoginPage