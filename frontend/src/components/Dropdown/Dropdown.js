import { React, useState } from "react";
import '../Dropdown/Dropdown.css';
import { BsFilterCircleFill } from "react-icons/bs"; 

function Dropdown({ selected, setSelected }) {
    const [isActive, setIsActive] = useState(false);
    const options = ['Likes', 'Recent'];
    return (
        <div className="dropdown">
            <div 
                className="dropdown-btn" 
                onClick={() => setIsActive(!isActive)}
            >
                {selected} <BsFilterCircleFill/>
            </div>
            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div className="dropdown-item" onClick={() => {
                            setSelected(option)
                            setIsActive(false)
                        }}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
