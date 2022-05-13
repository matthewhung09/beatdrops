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
  let navigate = useNavigate();

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

  const onSubmit = async (values) => {
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

  // info for required entries
  const rEntries = [{ input: "email", label: "Email" }];

  // sets popup to be open when page is first loaded
  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  return (
    <StylesProvider injectFirst>
      <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
        <div className="modal">
          <div className="header">
            {" "}
            <b>♬ beatdrops </b>{" "}
          </div>
          <button className="close" onClick={() => navigate("/")}>
            &times;
          </button>
          <PopupWrapper>
            <PopupTitle> Reset your password.</PopupTitle>
            <h2 style={{ lineHeight: "unset", color: "grey", fontWeight: "400" }}>
              Enter the email address that you used to register. We'll send you an email with a link
              to reset your password.
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
                            : name === "email" && vErr !== "" && value === cemail
                            ? vErr
                            : null
                        }
                        FormHelperTextProps={{
                          style: {
                            color: "#f44434",
                          },
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
                <StyledButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  //onClick={() => navigate("/reset-confirmation")}
                >
                  Submit
                </StyledButton>
                {/* <button className="login-btn" onClick={() => navigate("/password-reset")}>
                    Forgot your password?
                  </button> */}
              </Box>
            </form>
          </PopupWrapper>
        </div>
      </Popup>
    </StylesProvider>
  );
}

export default EmailResetForm;
