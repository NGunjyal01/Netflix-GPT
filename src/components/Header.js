import { useEffect,useState } from "react";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { SUPPORTED_LANG } from "../utils/constants";
import { toggleGPTSearch } from "../utils/GPTSlice";
import { changeLanguage } from "../utils/configSlice";
import { PiUserListFill } from "react-icons/pi";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const showGPTSearch = useSelector(store => store.GPT.showGPTSearch);
  const [isOpen,setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleGPTSearch = () => {
    dispatch(toggleGPTSearch());
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/body/browse");
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed z-20 w-full px-8 py-4 text-[#EEEEEE] bg-gradient-to-b from-black">
      {user && (
        <div className="grid grid-cols-12 w-full items-center">
          <h1 className="text-xl md:text-4xl font-bold top-10 col-span-4 md:col-span-2 hover:text-[#00ADB5]">L O G O</h1>
          <div className="hidden md:block col-span-4 mx-auto text-lg">
            <Link to="/body/browse" className="px-2 hover:text-[#00ADB5]">Home</Link>
            <Link to="/body/movies" className="px-2 hover:text-[#00ADB5]">Movies</Link>
            <Link to="/body/tvshows" className="px-2 hover:text-[#00ADB5]">TV Shows</Link>
            <Link to="/body/mylist" className="px-2 hover:text-[#00ADB5]">My List</Link>
            <Link to="/body/genre" className="px-2 hover:text-[#00ADB5]">Genre</Link>
          </div>
          {!showGPTSearch && <div className="col-span-8 md:col-span-6">
            <input type="text" placeholder="Search" className="w-[50%] md:p-4 md:pl-1 pl-1 p-2  text-black h-6 rounded-md"></input>
            <button className="mx-2 hover:text-[#00ADB5]">Search</button>
          </div>}
          <div className="absolute right-5 md:right-10">
            <span class="changecolor"> 
              <PiUserListFill size={40}
                onmouseover={({ target }) => (target.style.color = "#00ADB5")}
                onmouseout={({ target }) => (target.style.color = "#EEEEEE")}
                onClick={() => {setIsOpen(!isOpen)}}
              />
            </span>
          </div>
          {isOpen && <div className="absolute right-12 bg-[#EEEEEE] bg-opacity-60 top-14 text-black">
              <ul className="transition-all duration-300 ease-in-out items-center"> 
                <li className="px-4 py-2 w-full hover:bg-[#00ADB5]"><Link> Account</Link></li>
                <li className="px-4 py-2 w-full hover:bg-[#00ADB5]"><button onClick={handleGPTSearch}>
                {showGPTSearch?"HomePage":"GPT Search"}
                </button></li>
                <li className="px-4 py-2 w-full hover:bg-[#00ADB5]"><button onClick={handleSignOut}> Sign Out </button> </li>
              </ul>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Header;
