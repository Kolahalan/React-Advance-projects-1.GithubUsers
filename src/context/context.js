import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  //request loading

  const [requests, setRequests] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        //destructuring data as axios gives a lot of fields with data as a subfield
        let {
          rate: { remaining },
        } = data; //rate: { remaining } = data means, remaining field is inside rate which is inside data. console log data to see full json
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(
            true,
            "You have exceeded your hourly limit of 60 for this hour. Please wait for the api timer to reset for next search"
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  const searchGithubUser = async (user) => {
    //hangle error
    setisLoading(true);
    toggleError();
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      // console.log("response from axios :", response);
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results; //vars representing the response data from [axios req1, axios req2] in Promise.allSettled
          console.log("Results from Promise:", results);
          if (repos.status === "fulfilled") {
            setRepos(repos.value.data);
          }
          if (followers.status === "fulfilled") {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log);
    } else {
      toggleError(true, "There is no user with that username");
    }
    checkRequests();
    setisLoading(false);
  };

  useEffect(checkRequests, []); //setting checkrequests as a callback function to use it once when the app loads to remember the func

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        isLoading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubProvider, GithubContext };
