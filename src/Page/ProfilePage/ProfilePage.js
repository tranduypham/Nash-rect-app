import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";

const ProfilePage = () => {
    const token = localStorage.getItem("Authorization");
    const userId = localStorage.getItem("UserId");
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if (Boolean(userId)) {
            let header = {};
            if(Boolean(token)){
                header.Authorization = token;
            }
            axios({
                method: "GET",
                url: `https://60dff0ba6b689e001788c858.mockapi.io/users/${userId}`,
                headers: header
            })
                .then((res) => {
                    setProfile(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(true);
                })
        }

        return () => {
            setLoading(true);
            setError(false);
        }
    }, [userId, token])
    if (!Boolean(token)) {
        return (
            <div>
                <LoginPage message="You need to login to continue"></LoginPage>
            </div>
        )
    }
    if (isError) {
        return (
            <div>
                <h1 className="text-danger">
                    Error...
                </h1>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div>
                <h1>
                    LOADING...
                </h1>
            </div>
        )
    }
    return (
        <div className="col-6 bg-light p-3 rounded">
            <h1>Profile</h1>
            <div className="p-3">
                <p><b>Name :</b> {profile.name}</p>
                <p><b>UserID :</b> {profile.id}</p>
                <Link to="/">Back to home</Link>
            </div>
        </div>
    )
}

export default ProfilePage;