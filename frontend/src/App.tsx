
import Navbar from './components/Navbar'

import { Navigate, Route, Routes } from 'react-router'

import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import EditProductPage from './pages/EditProductPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EmailVerifyPage from './pages/EmailVerifyPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CreatePage from './pages/CreatePage'

const App = () => {

  const isAuthenticated = true;

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">

      {/* Navbar */}
      <Navbar />

      <main className='max-w-5xl mx-auto px-4 py-9'
        style={{ fontFamily: 'AEONIK' }}
      >
        <Routes>
          <Route path='/' element={<HomePage />} />

          <Route path='/product/:id' element={<ProductPage />} />

          <Route path='/edit/:id' element={isAuthenticated ? <EditProductPage /> : <Navigate to={"/"} />} />

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route path='/verify-email' element={<EmailVerifyPage />} />

          <Route path='/forgot-password' element={<ResetPasswordPage />} />

          <Route path='/create' element={<CreatePage />} />

        </Routes>
      </main>
    </div>
  )
}

export default App