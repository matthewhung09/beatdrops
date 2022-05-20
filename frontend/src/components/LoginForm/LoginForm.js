import { React } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Form from "../Form/Form";
import axios from "axios";
import "../../App.css";
import "../SignUpForm/SignUpForm.css";

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

  const onSubmitCall = async (values) => {
    console.log(values);
    let response = await axios.post(
      `${process.env.REACT_APP_URL}/login`,
      {
        email: values.email,
        password: values.password,
      },
      { withCredentials: true, credentials: "include" }
    );
    const data = response.data;
    // Route to main page if login info is correct
    if (data.user) {
      window.location.assign("/home");
    }
  };

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
      onSubmitCall={onSubmitCall}
    />
  );
}

export default LoginForm;
