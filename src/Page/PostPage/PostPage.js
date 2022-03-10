import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PostPage = () => {
    const { id } = useParams();
    const [token] = useState(localStorage.getItem("Authorization"));
    const [postDetail, setDetail] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    useEffect(() => {
        let header = {}
        if(Boolean(token)){
            header.Authorrization = token;
        }
        axios({
            method: "GET",
            url: `https://jsonplaceholder.typicode.com/posts/${id}`,
            headers: header
        })
            .then((res) => {
                setDetail(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
            })
    }, [id])

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
    console.log(postDetail);
    return (
        <div className="col-6 bg-light p-3 rounded">
            <p><b>ID:</b> {postDetail.id}</p>
            <p><b>Title:</b> {postDetail.title}</p>
            <p><b>Detail:</b> {postDetail.body}</p>
            <Link to="/posts">Back to list</Link>
        </div>
    )
}

export default PostPage;