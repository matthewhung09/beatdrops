import { React, useState } from "react";
import "../Dropdown/Dropdown.css";
import { BsFilterCircleFill } from "react-icons/bs";
import { IoMdArrowDropdownCircle } from "react-icons/io";

function Dropdown({ selected, setSelected, purpose }) {
    const [isActive, setIsActive] = useState(false);
    let options = [];
    purpose === "filter"
        ? (options = ["Likes", "Recent"])
        : (options = ["Settings", "Logout"]);

    return (
        <div className="dropdown">
            {purpose === "filter" ? (
                <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}>
                    {selected} <BsFilterCircleFill />
                </div>
            ) : (
                <div
                    className="dropdown-btn"
                    style={{
                        color: "white",
                        backgroundColor: "black",
                        width: "100%",
                        borderRadius: "5em",
                        textTransform: "capitalize",
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
                        {options.map((option) => (
                            <div
                                className="dropdown-item"
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
                        {options.map((option) => (
                            <div
                                className="dropdown-item"
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
