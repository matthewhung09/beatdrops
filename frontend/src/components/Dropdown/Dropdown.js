import { React, useState } from "react";
import "../Dropdown/Dropdown.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";

function Dropdown({ selected, setSelected, setLoggedIn, purpose }) {
  const [isActive, setIsActive] = useState(false);
  let options = [];
  purpose === "filter"
    ? (options = ["Likes", "Recent"])
    : setLoggedIn
    ? (options = ["Remove Spotify", "Logout"])
    : (options = ["Connect Spotify", "Logout"]);

  return (
    <div className="dropdown">
      {purpose === "filter" ? (
        <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}>
          {selected} <IoFilterSharp />
        </div>
      ) : (
        <div
          className="dropdown-btn"
          style={{
            color: "white",
            backgroundColor: "black",
            width: "100%",
            borderRadius: "5em",
            gap: "1em",
          }}
          onClick={() => setIsActive(!isActive)}
        >
          {selected} <IoMdArrowDropdownCircle />
        </div>
      )}
      {isActive &&
        (purpose === "filter" ? (
          <div
            className="dropdown-content"
            style={{
              width: "93%",
            }}
          >
            {options.map((option, index) => (
              <div
                className="dropdown-item"
                key={index}
                onClick={() => {
                  setSelected(option);
                  setIsActive(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="dropdown-content"
            style={{
              width: "110%",
              borderRadius: "1em",
              backgroundColor: "black",
              color: "white",
            }}
          >
            {options.map((option, index) => (
              <div
                className="dropdown-item"
                key={index}
                onClick={() => {
                  setSelected(option);
                  setIsActive(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default Dropdown;
