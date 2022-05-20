import { useState, React } from "react";
import styled from "styled-components";
import { Button, StylesProvider } from "@material-ui/core";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import "../../../App.css";
import "../../Form/Form.css";
import "./ConfirmationPopup.css";

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 85%;
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

function ConfirmationPopup({ message }) {
  let navigate = useNavigate();

  // sets popup to be open when page is first loaded
  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  return (
    <StylesProvider injectFirst>
      <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
        <div className="modal">
          <PopupWrapper>
            <BsFillCheckCircleFill className="checkIcon" />
            <h2 style={{ lineHeight: "unset", fontWeight: "500", fontSize: "2em" }}>
              {message}
              {/* A password reset link has been sent to the email address you submitted. */}
            </h2>
            <StyledButton
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Login
            </StyledButton>
          </PopupWrapper>
        </div>
      </Popup>
    </StylesProvider>
  );
}

export default ConfirmationPopup;
