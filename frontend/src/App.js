import Register from "./components/Register";
import Login from "./components/Login";
import LinkPage from './components/LinkPage';
import Home from './components/Home';
import Missing from './components/Missing';
import RequiredAuth from "./components/RequiredAuth";
import Admin from "./components/Admin";
import { Route, Routes } from 'react-router-dom';
import Layout from "./components/Layout";
import CreateRecipe from "./components/CreateRecipe";

function App () {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*public routes*/}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        

        {/*protected routes*/}
        <Route element={<RequiredAuth />} >
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="createRecipe" element={<CreateRecipe />} />
          
        </Route>

        {/*catch all*/}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
