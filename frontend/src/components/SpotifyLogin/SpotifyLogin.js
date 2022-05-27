import { useState, React } from "react";
import styled from "styled-components";
import { Button, StylesProvider } from "@material-ui/core";
import Popup from "reactjs-popup";
import "../../App.css";
// import "../SpotifyLogin/SpotifyLogin.css";
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
  padding: 8px;
  border-radius: none;
  text-transform: uppercase;
  margin-top: 10px;
  letter-spacing: 1.6px;
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
`;

function SpotifyLogin() {
  let navigate = useNavigate();

  // sets popup to be open when page is first loaded
  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  const PERMISSIONS = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-modify-private",
    "playlist-modify-public",
    "playlist-read-collaborative",
  ].join("%20");

  const redirect_url = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT}/home&scope=streaming%20${PERMISSIONS}`;

  return (
    <StylesProvider injectFirst>
      <Popup
        open={open}
        closeOnDocumentClick={false}
        onClose={closeModal}
      >
        {(close) => (
          <div className="modal">
            <button
              className="close"
              onClick={close}
            >
              &times;
            </button>
            <PopupWrapper>
              <PopupTitle> Connect with spotify </PopupTitle>
              <div className="actions">
                <StyledButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/signup")}
                >
                  Go Back
                </StyledButton>
                <a href={redirect_url}>
                  <StyledButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    // onClick={() => window.location.assign(AUTH_URL)}
                  >
                    Continue
                  </StyledButton>
                </a>
              </div>
            </PopupWrapper>
          </div>
        )}
      </Popup>
    </StylesProvider>
  );
}

export default SpotifyLogin;
