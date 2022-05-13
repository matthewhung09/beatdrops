import * as React from "react";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SpotifyLogin from "./components/SpotifyLogin/SpotifyLogin";
import LoginForm from "./components/LoginForm/LoginForm";
import EmailResetForm from "./components/PasswordReset/EmailResetForm";
import Home from "./components/Home/Home";
import PasswordForm from "./components/PasswordReset/PasswordForm";
import ConfirmationPopup from "./components/PasswordReset/ConfirmationPopup/ConfirmationPopup";
import ConfirmationPopup2 from "./components/PasswordReset/ConfirmationPopup/ConfirmationPopup2";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/spotify" element={<SpotifyLogin />} />
          <Route path="/password-reset" element={<EmailResetForm />} />
          <Route path="/reset/:userId/:token" element={<PasswordForm />} />
          <Route path="/email-success" element={<ConfirmationPopup />} />
          <Route path="/password-reset-success" element={<ConfirmationPopup2 />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
