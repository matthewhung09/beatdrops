import { useState, React } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StylesProvider } from "@material-ui/core";
import { TextField, InputAdornment, IconButton, Box } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Popup from "reactjs-popup";
import FormFooter from "../Form/FormFooter";
import axios from "axios";
import "../../App.css";
import "../SignUpForm/SignUpForm.css";

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

function Form({
  rEntries,
  validationSchema,
  formType,
  popupTitle,
  secondaryActionText,
  onClick,
  mainActionText,
  styles,
  instructions,
}) {
  let navigate = useNavigate();

  // validation
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [vErr, setvErr] = useState("");
  const [cemail, setEmail] = useState("");
  const [cpassword, setPassword] = useState("");

  // sets popup to be open when page is first loaded
  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  // set password visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    console.log(showPassword);
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onSubmitSignup = async (values) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/signup`,
        {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      navigate("/spotify");
    } catch (error) {
      setEmail(values.email);
      setvErr(error.response.data.errors);
    }
  };

  const onSubmitLogin = async (values) => {
    let response;
    try {
      response = await axios.post(
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
    } catch (error) {
      setEmail(values.email);
      setPassword(values.password);
      setvErr(error.response.data.errors);
    }
  };

  const { userId, token } = useParams();

  const onSubmitChooseNewPassword = async (values) => {
    try {
      console.log("hello");
      await axios.post(
        `${process.env.REACT_APP_URL}/reset/${userId}/${token}`,

        {
          password: values.password,
        },
        { withCredentials: true, credentials: "include" }
      );
      navigate("/password-reset-success");
    } catch (error) {
      setPassword(values.password);
      setvErr(error.response.data.errors);
    }
  };

  const onSubmitEmailReset = async (values) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/send-email`,
        {
          email: values.email,
        },
        { withCredentials: true, credentials: "include" }
      );
      navigate("/email-success");
    } catch (error) {
      console.log(error.response.data.message);
      setEmail(values.email);
      setvErr(error.response.data.message);
    }
  };

  return (
    <StylesProvider injectFirst>
      <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
        {() => (
          <div className="modal">
            <div className="header">
              {" "}
              <b>♬ beatdrops </b>{" "}
            </div>
            <PopupWrapper>
              <PopupTitle> {popupTitle} </PopupTitle>
              {(formType === "chooseNewPassword" || formType === "emailReset") && (
                <h2 style={{ lineHeight: "unset", color: "grey", fontWeight: "400" }}>
                  {instructions}
                </h2>
              )}
              <form
                style={{ width: "100%" }}
                onSubmit={() => {
                  if (formType === "signup") {
                    handleSubmit(onSubmitSignup);
                  } else if (formType === "login") {
                    handleSubmit(onSubmitLogin);
                  } else if (formType === "chooseNewPassword") {
                    handleSubmit(onSubmitChooseNewPassword);
                  } else {
                    handleSubmit(onSubmitEmailReset);
                  }
                }}
              >
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
                      // form inputs
                      <Box m={2}>
                        <TextField
                          fullWidth
                          key={name}
                          variant={"outlined"}
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
                              : name === "username" && vErr.username !== ""
                              ? vErr.username
                              : null
                          }
                          // allows text to be displayed
                          type={
                            (entry.input === "password" && showPassword) || entry.input === "email"
                              ? "text"
                              : "password"
                          }
                          FormHelperTextProps={{
                            style: {
                              color: "#f44434",
                            },
                          }}
                          // conditionally render the visibility toggle for passwords
                          InputProps={
                            entry.input === "password"
                              ? {
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
                                }
                              : undefined
                          }
                        />
                      </Box>
                    )}
                  />
                ))}
                <FormFooter
                  secondaryActionText={secondaryActionText}
                  onClick={onClick}
                  mainActionText={mainActionText}
                  formType={formType}
                  styles={styles}
                />
              </form>
            </PopupWrapper>
          </div>
        )}
      </Popup>
    </StylesProvider>
  );
}

export default Form;
