import * as React from "react"
import "reactjs-popup/dist/index.css"
import "./App.css"
import SignUpForm from "./components/SignUpForm/SignUpForm"
import SpotifyLogin from "./components/SpotifyLogin/SpotifyLogin"
import LoginForm from "./components/LoginForm/LoginForm"
import Home from "./components/Home/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/spotify" element={<SpotifyLogin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
