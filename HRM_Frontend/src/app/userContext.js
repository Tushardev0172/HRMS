"use client"
/// rember this will only work in client components always use "use Client" to use this context file
import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { getDataWithToken } from './requestConfig';

const UserData = createContext();

export const UserProvider = ({ children }) => {
  const [cookies] = useCookies(['token']);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [user, setUser] = useState('');
  const [userDetails, setUserDetails] = useState('')
  useEffect(() => {
    if (cookies.token) {
      const decodedToken = jwt.decode(cookies.token);
      if (decodedToken) {
        setUser(decodedToken);
      }
    }
  }, [cookies.token]);

  const punchIn = () => {
    setIsPunchedIn(true);
  };

  const punchOut = () => {
    setIsPunchedIn(false);
  };

  useEffect(() => {
    const handleName = async () => {
      if (user) {
        const response = await getDataWithToken(`http://localhost:3210/getSingleEmp/${user.id}`)
        setUserDetails(response.data)
      }
    }
    handleName();
  }, [user]);

  return (
    <UserData.Provider value={{ user, punchIn, isPunchedIn, punchOut,userDetails }}>
      {children}
    </UserData.Provider>
  );
};

// export default UserProvider;
/// using this here so that i can access the context directly where ever needed
export const useUser = () => useContext(UserData);
