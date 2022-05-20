import { React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import Form from "../Form/Form";

function ChooseNewPasswordForm() {
  let navigate = useNavigate();

  // info for required entries
  const rEntries = [{ input: "password", label: "Password" }];

  // validation
  const passwordRegExp =
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Please enter your password.")
      .matches(
        passwordRegExp,
        "Password must contain at least 8 characters, one uppercase, one number, and one special case character."
      ),
  });

  const { userId, token } = useParams();

  const onSubmitCall = async (values) => {
    await axios.post(
      `${process.env.REACT_APP_URL}/reset/${userId}/${token}`,

      {
        password: values.password,
      },
      { withCredentials: true, credentials: "include" }
    );
    navigate("/password-reset-success");
  };

  return (
    <Form
      rEntries={rEntries}
      validationSchema={validationSchema}
      formType="chooseNewPassword"
      popupTitle="Choose a new password."
      instructions="Your new password must contain at least 8 characters, one uppercase, one number,
                  and one special case character."
      onSubmitCall={onSubmitCall}
    />
  );
}

export default ChooseNewPasswordForm;
