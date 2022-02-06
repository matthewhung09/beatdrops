import { React, useState } from "react";
import '../Dropdown/Dropdown.css';
import { BsFillCaretDownFill } from "react-icons/bs"; 

function Dropdown({ selected, setSelected }) {
    const [isActive, setIsActive] = useState(false);
    const options = ['Likes', 'Recent'];
    return (
        <div className="dropdown">
            <div className="dropdown-btn" 
                onClick={(e) => setIsActive(!isActive)}
            >
                {selected}
                <BsFillCaretDownFill></BsFillCaretDownFill>
                {/* <span className="fas fa-caret-down"></span> */}
            </div>
            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div 
                            onClick={(e) => {
                                setSelected(option)
                                setIsActive(false)
                            }} 
                            className="dropdown-item"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
