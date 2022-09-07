import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const CREATE_RECIPE_URL = '/recipe/createRecipe';

const CreateRecipe = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  //ref

  const errRef = useRef();

  //recipeName
  const [recipeName, setRecipeName] = useState('');
  const [recipeIntro, setRecipeIntro] = useState('');
  const [recipeMethods, setRecipeMethods] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  //errorMsg
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipe = {
      user: auth.user,
      recipeName: recipeName,
      intro: recipeIntro,
      ingredients: recipeIngredients,
      method: recipeMethods,
    };
    var recipe_json = JSON.stringify(recipe, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    try {
      const response = await axiosPrivate.post(CREATE_RECIPE_URL, recipe_json);
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));

      //clear state and controlled inputs
      //need value attrib on inputs for this
      setRecipeName('');
      setRecipeIntro('');
      setRecipeMethods('');
      setRecipeIngredients('');
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Create Recipe Failed');
      }
    }
  };


  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/">Home</Link>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Register</h1>
          {/*form to submit*/}
          <form onSubmit={handleSubmit}>

            {/*Recipe name section*/}
            <label htmlFor="recipeName">
              Recipe Name:
            </label>
            <textarea
              type="text"
              id="recipeName"
              autoComplete="off"
              onChange={(e) => setRecipeName(e.target.value)}
              value={recipeName}
              required
            />
            {/*Intro section*/}
            <label htmlFor="recipeIntro">
              Introduction:
            </label>
            <textarea
              type="text"
              id="recipeIntro"
              onChange={(e) => setRecipeIntro(e.target.value)}
              value={recipeIntro}
              required
            />
            {/*Ingredients section*/}
            <label htmlFor="recipeIngredients">
              Ingredients:
            </label>
            <textarea
              type="text"
              id="recipeIngredients"
              onChange={(e) => setRecipeIngredients(e.target.value)}
              value={recipeIngredients}
              required
            />
            {/*Method section*/}
            <label htmlFor="recipeMethods">
              Methods:
            </label>
            <textarea
              type="text"
              id="recipeMethods"
              onChange={(e) => setRecipeMethods(e.target.value)}
              value={recipeMethods}
              required
            />

            <button disabled={!recipeName || !recipeMethods || !recipeIntro || !recipeIngredients
              ? true : false}>Submit Recipe Now</button>
          </form>
          <p>
            Back To Home Page<br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/">Home</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );

};

export default CreateRecipe;