import { React } from "react";
import { Box, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled(Button)`
  background-color: black;
  padding: 15px;
  border-radius: 100px;
  text-transform: uppercase;
  margin-top: 30px;
  letter-spacing: 2px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  color: white;
  cursor: pointer;
`;

function FormFooter({ secondaryActionText, onClick, mainActionText, formType, styles }) {
  let navigate = useNavigate();
  return (
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
      >
        Continue
      </StyledButton>
      {formType === "login" && (
        <button
          className="login-btn"
          style={{ marginTop: -90, marginLeft: -255 }}
          onClick={() => navigate("/password-reset")}
        >
          Forgot your password?
        </button>
      )}

      <div
        className="login"
        style={styles}
      >
        <div className="login-text">{secondaryActionText}</div>
        <button
          className="login-btn"
          onClick={onClick}
        >
          {mainActionText}
        </button>
      </div>
    </Box>
  );
}

export default FormFooter;
