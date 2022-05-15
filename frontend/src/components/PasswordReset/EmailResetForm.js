import { useState, React } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styled from "styled-components";
import { TextField, Box, Button, StylesProvider } from "@material-ui/core";
import Popup from "reactjs-popup";
import "../../App.css";
import "../SignUpForm/SignUpForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "../Form/Form";

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 85%;
`;

const PopupTitle = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  color: black;
  text-align: center;
  max-width: 85%;
  margin-top: 12px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  background-color: black;
  padding: 15px;
  border-radius: 100px;
  text-transform: uppercase;
  margin-top: 10px;
  letter-spacing: 2px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  color: white;
  cursor: pointer;
`;

function EmailResetForm() {
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
