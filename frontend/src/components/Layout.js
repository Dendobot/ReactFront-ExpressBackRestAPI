import { Outlet } from "react-router-dom";



const Layout = () => {
  return (
    <main class="App">
      <Outlet />
    </main>
  );
};

export default Layout;