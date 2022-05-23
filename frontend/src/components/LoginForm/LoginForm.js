import { React } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import Form from "../Form/Form";

function LoginForm() {
  let navigate = useNavigate();

  // info for required entries
  const rEntries = [
    { input: "email", label: "Email" },
    { input: "password", label: "Password" },
  ];

  // validation
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Please enter your email."),
    password: Yup.string().required("Please enter your password."),
  });

  return (
    <Form
      rEntries={rEntries}
      validationSchema={validationSchema}
      formType="login"
      popupTitle="Login to your account."
      secondaryActionText="Don't have an account?"
      onClick={() => navigate("/signup")}
      mainActionText="SIGNUP"
      styles={{ marginTop: 100, marginBottom: -22 }}
    />
  );
}

export default LoginForm;
