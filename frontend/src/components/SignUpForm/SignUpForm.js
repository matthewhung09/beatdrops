import React from "react";
import { TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import isEmailValidator from 'validator/lib/isEmail';

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PopupTitle = styled.h1`
  font-style: normal;
  font-weight: 400;
  font-size: 23px;
  color: black;
  max-width: 90%;
`;

const Button = styled.button`
  background-color: black;
  padding: 16px;
  text-transform: uppercase;
  margin-top: 25px;
  letter-spacing: 2px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  color: white;
  cursor: pointer;
`;

function SignUpForm() {
    // style
    const variant = "outlined";
  
    // validation
    const passwordRegExp = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
    const validationSchema = Yup.object().shape({
        email: Yup
            .string()      
            .email("Invalid email format.")
            .required("Please enter your email.")
            .test("is-valid", (message) => `${message.path} is invalid.`, (value) => value ? isEmailValidator(value) : new Yup.ValidationError("Invalid value.")),
        password: Yup
            .string()
            .required("Please enter your password.")
            .matches(passwordRegExp,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character."
            ),
        username: Yup
            .string()
            .required("Username is a required field.")
        // need to check if username is already taken!
    });
    const { handleSubmit, control, reset } = useForm({
      resolver: yupResolver(validationSchema),
    });
  
    // log values when data is submitted
    const onSubmit = (values) => {
    //   console.log(values);
      reset();
    };
  
    // info for required entries
    const rEntries = [
      { name: "email", label: "Email" },
      { name: "password", label: "Create a password" },
      { name: "username", label: "What should we call you?" },
    ];

    return (
      <PopupWrapper>
        <PopupTitle> Sign up for a free <b>beatdrops</b> account.</PopupTitle>
        <form style={{width: "100%"}} onSubmit={handleSubmit(onSubmit)}>
            {rEntries.map((entry) => (
            <div>
                <Controller
                key={entry.name}
                name={entry.name}
                defaultValue=""
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <Box m={2}>
                    <TextField 
                        style={{marginBottom: 5}}
                        fullWidth
                        label={entry.label}
                        variant={variant}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                    </Box>
                )}
                />
            </div>
            ))}
            <Box m={2}>
                <Button type="submit" onClick={onSubmit}>Continue</Button>
                <p>Already have an account? LOGIN</p>
            </Box>
        </form>
      </PopupWrapper>
    );
}

export default SignUpForm;
