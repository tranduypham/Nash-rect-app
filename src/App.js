import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

// Boostrap component
import { Button, Container } from "react-bootstrap";

// Custom css
import "./App.css";
// Main page
import HomePage from "./Page/HomePage/HomePage";
import LoginPage from "./Page/LoginPage/LoginPage";
import PostsPage from "./Page/PostsPage/PostsPage";
import ProfilePage from "./Page/ProfilePage/ProfilePage";
import PostPage from "./Page/PostPage/PostPage";
// FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export const Context = createContext();

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("Authorization"));
  const isLogin = Boolean(token);
  
  console.log("token", token);
  console.log("isLogin", isLogin);

  // NOTE: as discussed earlier, useEffect should not be used without
  // the dependancy list, i have added a log below to chech how many time it has been rerun
  // RESOLVE : Resolved by using global variable [token, setToken] using Context
  useEffect(() => {
    console.log("Appjs rerender");
    setToken(localStorage.getItem("Authorization"));
  },[token]);

  const handleLogin = (event) => {
    console.log("log out");
    localStorage.removeItem("Authorization");
    localStorage.removeItem("UserId");
    setToken(localStorage.getItem("Authorization"));
    navigate("/login");
  };

  return (
    <Context.Provider value={[token, setToken]}>
      <Container className="App p-3">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              {!isLogin ? (
                <Link to="/login">Login</Link>
              ) : (
                <Button variant="secondary" onClick={handleLogin}>
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="pe-1"
                  ></FontAwesomeIcon>
                  Log out
                </Button>
              )}
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Container>
    </Context.Provider>
  );
}

export default App;
