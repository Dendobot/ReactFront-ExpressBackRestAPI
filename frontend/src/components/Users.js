import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const ADMIN_URL = '/admin';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);


  useEffect(() => {

    let isMounted = true;
    const controller = new AbortController();

    console.log("requesting Users list");

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(ADMIN_URL, {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        navigate('/login', { state: { from: location }, replace: true });
        console.error(err);
      }
    };
    getUsers();

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

      <h2>Users List</h2>
      {users?.length
        ? (
          <ul>
            {users.map((users, i) =>
              <li key={i}>{users?.username}</li>)}
          </ul>
        ) : <p>No users to display</p>

      }


    </article>
  );
};

export default Users;