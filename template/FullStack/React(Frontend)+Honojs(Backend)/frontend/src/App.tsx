import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Signup from './pages/SignUp'
import Signin from './pages/SignIn'
import TermsOfService from './pages/TermsOfService'
import ContactUs from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />}/>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/terms' element={<TermsOfService />}/>
        <Route path='/contact' element={<ContactUs />}/>
        <Route path='/privacy' element={<PrivacyPolicy />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
