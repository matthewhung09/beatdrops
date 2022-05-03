import { useState, React } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styled from "styled-components";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Button,
  StylesProvider,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import isEmailValidator from "validator/lib/isEmail";
import Popup from "reactjs-popup";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import "../SignUpForm/SignUpForm.css";
import axios from "axios";

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

function PasswordForm() {
  // style
  const variant = "outlined";

  // validation
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Please enter your email."),
  });
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [vErr, setvErr] = useState("");
  const [cemail, setEmail] = useState("");
  const [cpassword, setPassword] = useState("");

  let prefix = process.env.REACT_APP_URL_LOCAL;
  if (process.env.NODE_ENV === "production") {
    prefix = process.env.REACT_APP_URL_PROD;
  }

  const onSubmit = async (values) => {
    try {
      await axios.post(
        `${prefix}/send-email`,
        {
          email: values.email,
        },
        { withCredentials: true, credentials: "include" }
      );
    } catch (error) {
      setEmail(values.email);
      setPassword(values.password);
      setvErr(error.response.data.errors);
    }
  };

  // info for required entries
  const rEntries = [
    { input: "password", label: "Password" },
    { input: "confirmed", label: "Confirm password" },
  ];

  // sets popup to be open when page is first loaded
  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  // set password visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <StylesProvider injectFirst>
      <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
        {(close) => (
          <div className="modal">
            <div className="header">
              {" "}
              <b>♬ beatdrops </b>{" "}
            </div>
            <button className="close" onClick={close}>
              &times;
            </button>
            <PopupWrapper>
              <PopupTitle> Choose a new password.</PopupTitle>
              <h2 style={{ lineHeight: "unset", color: "grey", fontWeight: "400" }}>
                It should be at least 8 characters long, and it must include a capital letter and a
                special character.
              </h2>
              <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                {rEntries.map((entry, index) => (
                  <Controller
                    defaultValue=""
                    key={index}
                    name={entry.input} // unique name of your input
                    control={control} // control obj from invoking useForm
                    // render prop: technique for sharing code between React components using a prop whose value is a function
                    render={({
                      field: {
                        value, // curr val of controlled component
                        name, // input's name being registered
                        onChange, // sends input's val to library
                      },
                      fieldState: {
                        error, // err for this specific input
                      },
                    }) => (
                      <Box m={2}>
                        <TextField
                          fullWidth
                          key={name}
                          variant={variant}
                          label={entry.label}
                          onChange={onChange}
                          error={!!error}
                          helperText={
                            error
                              ? error.message
                              : name === "email" && vErr.email !== "" && value === cemail
                              ? vErr.email
                              : name === "password" && vErr.password !== "" && value === cpassword
                              ? vErr.password
                              : null
                          }
                          type={showPassword ? "text" : "password"}
                          FormHelperTextProps={{
                            style: {
                              color: "#f44434",
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  style={{
                                    width: 50,
                                  }}
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    )}
                  />
                ))}

                {/* component for styling */}
                <Box
                  m={2}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <StyledButton fullWidth type="submit" variant="contained" color="primary">
                    Continue
                  </StyledButton>
                </Box>
              </form>
            </PopupWrapper>
          </div>
        )}
      </Popup>
    </StylesProvider>
  );
}

export default PasswordForm;