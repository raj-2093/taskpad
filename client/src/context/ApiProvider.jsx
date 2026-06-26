import axios from "axios";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const ApiContext = createContext(null);
export const useApi = () => useContext(ApiContext);

export default function ApiProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create api instance once and reuse it
  const apiRef = useRef(null);
  
  if (!apiRef.current) {
    apiRef.current = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          BASE_URL + API_PATHS.AUTH.REFRESH,
          {},
          {
            withCredentials: true,
          },
        );

        setAccessToken(response.data.data.accessToken);
      } catch (error) {
        console.error(`Error at fetchToken: ${error}`);
        setAccessToken("");
      }
    };

    fetchToken();
  }, []);

  const attachRequestInterceptor = () => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = "Bearer " + accessToken;
        }

        return config;
      },
      (error) => {
        console.error(`Error at attachRequestInterceptor: ${error}`);
        throw error;
      },
    );

    return reqInterceptor;
  };

  const attachResponseInterceptor = () => {
    const refresh = async () => {
      const response = await axios.post(
        BASE_URL + API_PATHS.AUTH.REFRESH,
        {},
        {
          withCredentials: true,
        },
      );
    };

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const config = error.config;
        if (error.response && error.response.status === 401 && !config._retry) {
          config._retry = true;
          refresh()
            .then((response) => {
              const { accessToken } = response.data.data;
              setAccessToken(accessToken);
              config.headers["Authorization"] = `Bearer ${accessToken}`;
              return api(config);
            })
            .catch((error) => {
              console.error(`Error at resInterceptor: ${error}`);
            });
        }
      },
    );

    return resInterceptor;
  };

  const fetchUser = async () => {
    const response = await api.get(API_PATHS.AUTH.GET_USER_PROFILE);
    return response;
  };

  useEffect(() => {
    const reqInterceptor = attachRequestInterceptor();
    const resInterceptor = attachResponseInterceptor();
    
    if (accessToken && !user) {
      fetchUser()
        .then((response) => {
          setUser(response.data.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error(`Error at fetchUser: ${error}`);
          setLoading(false);
        });
      // setLoading(false);
    } else if (accessToken === "") {
      setLoading(false);
    }

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);

  return (
    <ApiContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        api,
        loading,
        setLoading,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
