import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const RECIPE_URL = '/recipe';

const DisplayRecipes = () => {
  const [recipeNames, setRecipesNames] = useState();
  const [recipeIDs, setRecipeIDs] = useState();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);


  useEffect(() => {

    let isMounted = true;
    const controller = new AbortController();



    const getRecipes = async () => {
      try {
        const response = await axiosPrivate.get(RECIPE_URL,
          {
            signal: controller.signal
          });

        const obj = JSON.parse(response.data);

        isMounted && setRecipesNames(obj.recipeNameArray) && setRecipeIDs(obj.recipeIdArray);
        console.log(recipeNames);
        console.log(recipeIDs);

      } catch (err) {
        console.log('wtf');
        console.error(err);
      }
    };
    getRecipes();

    return () => {
      isMounted = false;
      if (effectRan.current === true) {
        controller.abort();
      }
      effectRan.current = true;

    };

  }, [navigate, axiosPrivate, location]);




  return (
    
    <article>
      <h2>recipeNames List</h2>
      {recipeNames?.length
        ? (
          <ul>
            {recipeNames.map((users, i) =>
              <li className="star" key={i}>{recipeNames[i]}</li>)}
          </ul>
        ) : <p>No users to display</p>

      }
    </article>
  );
};

export default DisplayRecipes;