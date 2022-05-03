import * as React from "react";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SpotifyLogin from "./components/SpotifyLogin/SpotifyLogin";
import LoginForm from "./components/LoginForm/LoginForm";
import EmailResetForm from "./components/EmailResetForm/EmailResetForm";
import Home from "./components/Home/Home";
import PasswordForm from "./components/PasswordForm.java/PasswordForm";

function App() {
  // console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
  // if (process.env.NODE_ENV === "production") {
  //   process.env.REACT_APP_URL_PROD = "https://beatdrops.herokuapp.com/";
  //   console.log(process.env.REACT_APP_URL_PROD);
  // }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/spotify" element={<SpotifyLogin />} />
          <Route path="/password-reset" element={<EmailResetForm />} />
          <Route path="/reset/*" element={<PasswordForm />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
