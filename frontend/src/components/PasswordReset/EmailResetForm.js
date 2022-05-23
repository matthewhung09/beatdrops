import { React } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import Form from "../Form/Form";

function EmailResetForm() {
  let navigate = useNavigate();
  // info for required entries
  const rEntries = [{ input: "email", label: "Email" }];

  // validation
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Please enter your email."),
  });

  return (
    <Form
      rEntries={rEntries}
      validationSchema={validationSchema}
      formType="emailReset"
      popupTitle="Reset your password."
      instructions="Enter the email address that you used to register. We'll send you an email with a
                  link to reset your password."
    />
  );
}

export default EmailResetForm;
