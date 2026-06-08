
import React, { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuthContext } from "../context/AuthContext";
import { useRegister } from "../hooks/useAuth";
import { toast } from 'react-toastify'

const RegisterPage = () => {

  const navigate = useNavigate();

  const { checkAuth } = useAuthContext()

  const registerMutation = useRegister()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [image, setImage] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      // await registerMutation.mutateAsync(formData)
      const data = new FormData()

      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)

      if (image) {
        data.append("image", image)
      }

      await registerMutation.mutateAsync(data)

      toast.success("Registered Successfully")
      await checkAuth()
      navigate("/")

    } catch (error) {
      console.log(error)
      toast.error("Registration Failed")
    }

  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-9 flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-6 text-center"
        style={{ fontFamily: 'LEMONMILK' }}
      >Create Your Account</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4"
      >

        {/* <input type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        /> */}

        {/* Avatar Upload */}
        <div className="flex justify-center mb-4">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center bg-base-200">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-base-content/60">Upload</span>
              )}
            </div>
          </label>
          <input type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

        </div>

        <input
          className="input input-bordered w-full"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          className="input input-bordered w-full"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button
          className="btn btn-primary w-full"
        >
          Register
        </button>
      </form>

      <div className="mt-3">
        Already have an account?
        <Link to="/login" className="link text-sm ml-2 text-primary">
          Login here
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage