import { useState, React} from "react";
import styled from "styled-components";
import { Button, StylesProvider } from "@material-ui/core";
import Popup from 'reactjs-popup';
import '../../App.css';
import { useNavigate, useLocation } from "react-router-dom";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=31aab7d48ba247f2b055c23b5ac155d8&response_type=code&redirect_uri=http://localhost:3000/home&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

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
    const user = useLocation();
    
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
                    <div className="login-button">
                      <a href={AUTH_URL}>
                        LOGIN WITH SPOTIFY
                      </a>
                    </div>
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
                        onClick={() => navigate("/home", {state: user})}
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

