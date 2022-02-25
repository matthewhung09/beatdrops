import { useState, React} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styled from "styled-components";
import { TextField, InputAdornment, IconButton, Box, Button, StylesProvider } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import isEmailValidator from 'validator/lib/isEmail';
import Popup from 'reactjs-popup';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import '../SignUpForm/SignUpForm.css';
import axios from 'axios';

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

// const register = () => {
//     axios.post('https://localhost:5000/user', {
//        username: a,
//        password: a,
//     }).then((response) => {
//         console.log(response);
//     });
// };

function SignUpForm() {
    let navigate = useNavigate();

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
    const onSubmit = async (values) => {
      // console.log(values);
      let response;
      try {
        response = await axios.post('http://localhost:5000/signup', {
          username: values.username,
          email: values.email,
          password: values.password,
        });
      }
      catch (error) {
        console.log(error);
      }
      // reset();
      console.log(response.data);
      navigate("/spotify", {state: response.data});
    };
  
    // info for required entries
    const rEntries = [
      { input: "email", label: "Email" },
      { input: "password", label: "Create a password" },
      { input: "username", label: "What should we call you?" },
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
          {close => (
            <div className="modal">
              <div className="header"> <b>♬ beatdrops </b> </div>
              <button className="close" onClick={close}>&times;</button>
              <PopupWrapper>
                <PopupTitle> Sign up for a free beatdrops account.</PopupTitle>
                <form style={{width: "100%"}} onSubmit={handleSubmit(onSubmit)}>
                    {rEntries.map((entry) => (
                      <Controller defaultValue="" key={entry.input}
                        name={entry.input} // unique name of your input
                        control={control} // control obj from invoking useForm
                        // render prop: technique for sharing code between React components using a prop whose value is a function
                        render={({
                            field: { 
                              // value, // curr val of controlled component
                              name, // input's name being registered
                              onChange // sends input's val to library
                            },
                            fieldState: { 
                              error // err for this specific input
                            }, 
                        }) => (
                            <Box m={2}>
                              {entry.input === "password" ? (
                                <TextField fullWidth key={name}
                                  variant={variant}
                                  label={entry.label}
                                  onChange={onChange}
                                  error={!!error}
                                  helperText={error ? error.message : null}
                                  type={showPassword ? "text" : "password"}
                                  InputProps={{ 
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton style={{width: 50}}
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                        >
                                          {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              ) : (
                                <TextField fullWidth key={name}
                                  variant={variant}
                                  label={entry.label}
                                  onChange={onChange}
                                  error={!!error}
                                  helperText={error ? error.message : null}
                                />
                              )}
                            </Box>
                        )}
                      />
                    ))}
                    {/* component for styling */}
                    <Box m={2}
                      display="flex" 
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <StyledButton fullWidth
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate("/spotify")}
                      >
                        Continue
                      </StyledButton>
                      {/* need to add route to login page */}
                      <span className="login" style={{marginTop: 45, marginBottom: -22}}>
                        Already have an account? 
                        <button className="login-btn" onClick={()=>navigate("/")}> 
                          LOGIN
                        </button> 
                      </span> 
                    </Box>
                </form>
              </PopupWrapper>
            </div>
          )}
        </Popup>
      </StylesProvider>
    );
}

export default SignUpForm;
