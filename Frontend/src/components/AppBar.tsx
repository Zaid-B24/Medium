import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"
import { AccountDropdown } from './AccountDropdown'; 
import { useState } from "react";

export const AppBar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };
    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={"/blogs"} className="flex-col justify-center">
            <div >
                <img src="/Medium.jpg" style={{ width: '200px', height: 'auto' }}></img>
            </div>
            </Link>
            <div>
            <Link to={`/publish`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>

            <Avatar size="big" name="harkirat" onClick={toggleDropdown} />
          {showDropdown && <AccountDropdown />}
        </div>
        </div>
    )
}