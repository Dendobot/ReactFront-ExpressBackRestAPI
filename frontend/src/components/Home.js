import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from '../api/axios';
import DisplayRecipes from "./DisplayRecipes";
import useAuth from "../hooks/useAuth";


const LOGOUT_URL = 'users/logout';
const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user= auth.user


  const logout = async () => {
    // if used in more components, this should be in context 
    // axios to /logout endpoint 
    console.log("logging out");
    try {
      const response = await axios.get(LOGOUT_URL, { withCredentials: true });
      if (response) {
        console.log("logged out");
      } else {
        console.log("No Server Response");
      }
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }

    setAuth({});
    navigate('/linkpage');
  };

  return (
    <section>
  
      <h1>Home </h1>
      <p>Hello {user}</p>
      <br />
      <p>You are logged in! </p>
      <div className="flexGrow">
        <button onClick={logout}>Sign Out</button>
      </div>
      <br />
      <Link to="/linkpage">Go to the link page</Link>
      <br />
      <Link to="/admin">Go to the Admin page</Link>
      <br />
      <Link to="/createRecipe">
        <button>Create a recipe now!</button>
      </Link>
      <br />
      <DisplayRecipes />
      
    </section>
  );
};

export default Home;