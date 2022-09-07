import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


/*this is a hook to attach access token with the axios, 
and if an error occur, ie the accessToken is expired, we'll send the refresh token
via use RefreshToken hook to the backend route "/users/refresh",and to recieve an access token,
then we'll retry the axios request with the access token we've received
*/
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();


  //intercepter
  useEffect(() => {

    //fisrt request use the token from useAuth
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, (error) => Promise.reject(error)
    );

    //failed request
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      //if the accessToken expires
      async (error) => {
        const prevRequest = error?.config;
        //retry once
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          //new access token
          const newAccessToken = await refresh();
          //try again
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        //reject this error
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };


  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;