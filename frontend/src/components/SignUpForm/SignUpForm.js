import { React } from "react";
import { useNavigate } from "react-router-dom";
import isEmailValidator from "validator/lib/isEmail";
import * as Yup from "yup";
import Form from "../Form/Form";

function SignUpForm() {
  let navigate = useNavigate();

  // info for required entries
  const rEntries = [
    { input: "email", label: "Email" },
    { input: "password", label: "Create a password" },
    { input: "username", label: "What should we call you?" },
  ];

  // validation
  const passwordRegExp =
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format.")
      .required("Please enter your email.")
      .test(
        "is-valid",
        (message) => `${message.path} is invalid.`,
        (value) => (value ? isEmailValidator(value) : new Yup.ValidationError("Invalid value."))
      ),
    password: Yup.string()
      .required("Please enter your password.")
      .matches(
        passwordRegExp,
        "Password must contain at least 8 characters, one uppercase, one number, and one special case character."
      ),
    username: Yup.string().required("Please enter a nickname."),
  });

  return (
    <Form
      rEntries={rEntries}
      validationSchema={validationSchema}
      formType="signup"
      popupTitle="Sign up for a free beatdrops account."
      secondaryActionText="Already have an account?"
      onClick={() => navigate("/")}
      mainActionText="LOGIN"
      styles={{ marginTop: 50, marginBottom: -20 }}
    />
  );
}

export default SignUpForm;
