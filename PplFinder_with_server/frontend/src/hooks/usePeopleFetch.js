import { useState, useEffect } from "react";
import axios from "axios";

export const usePeopleFetch = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchUsers(country_list, pageNo = 1, isCountryUpdate) {
    setIsLoading(true);
    const token=(await await axios.get(`http://localhost:5000/api/v1/user/get_token`)).data.token; /// get token from the server

    const response = await axios.get(`http://localhost:5000/api/v1/user?limit=25&page=${pageNo}&nat=${country_list}`,{
      headers: {
          'authorization': `Bearer ${token}` 
      }
    });
    setIsLoading(false);

    if (isCountryUpdate) {
      setUsers(response.data.data);
    } else {
      setUsers(prevUsers => {
        return [...new Set([...prevUsers, ...response.data.data])]
      })
    }



  }

  return { users, isLoading, fetchUsers };
};
