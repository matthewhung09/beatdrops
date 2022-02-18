import { useState, React} from "react";
import styled from "styled-components";
import { Button, StylesProvider } from "@material-ui/core";
import Popup from 'reactjs-popup';
import '../../App.css';
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


function SpotifyLogin() {
    let navigate = useNavigate();

    // sets popup to be open when page is first loaded
    const [open, setOpen] = useState(true);
    const closeModal = () => setOpen(false);

    return (
      <StylesProvider injectFirst>
        <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
          {close => (
            <div className="modal">
                <button className="close" onClick={close}>&times;</button>
                <PopupWrapper>
                    <PopupTitle> Connect with spotify </PopupTitle>
                    <StyledButton fullWidth
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate("/signup")}
                    >
                        Go Back
                    </StyledButton>
                    <StyledButton fullWidth
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate("/home")}
                    >
                        Continue
                    </StyledButton>
                </PopupWrapper>
            </div>
          )}
        </Popup>
      </StylesProvider>
    );
}

export default SpotifyLogin;

