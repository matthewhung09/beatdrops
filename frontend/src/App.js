import * as React from "react";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SpotifyLogin from "./components/SpotifyLogin/SpotifyLogin";
import LoginForm from "./components/LoginForm/LoginForm";
import EmailResetForm from "./components/PasswordReset/EmailResetForm";
import Home from "./components/Home/Home";
import ChooseNewPasswordForm from "./components/PasswordReset/ChooseNewPasswordForm";
import ConfirmationPopup from "./components/PasswordReset/ConfirmationPopup/ConfirmationPopup";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginForm />}
          />
          <Route
            path="/signup"
            element={<SignUpForm />}
          />
          <Route
            path="/spotify"
            element={<SpotifyLogin />}
          />
          <Route
            path="/password-reset"
            element={<EmailResetForm />}
          />
          <Route
            path="/reset/:userId/:token"
            element={<ChooseNewPasswordForm />}
          />
          <Route
            path="/email-success"
            element={
              <ConfirmationPopup message="A password reset link has been sent to the email address you submitted." />
            }
          />
          <Route
            path="/password-reset-success"
            element={<ConfirmationPopup message="Your password has been successfully updated." />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
