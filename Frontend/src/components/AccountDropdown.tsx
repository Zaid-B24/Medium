import {  useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation
import { LogOut } from 'lucide-react'; // Assuming you have these icons imported



export function AccountDropdown() {
    const navigate = useNavigate();
    
    
    const handleSignout = () => {
        localStorage.removeItem("token");
        navigate("/signin")
    }
  return (<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleSignout}>
      <div className="flex items-center">
        <LogOut size={15} className="mr-3" />
        <span>Sign Out</span>
      </div>
    </div>
  </div>
  );
}
