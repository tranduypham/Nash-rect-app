// Axios
import axios from "axios";

import React, { useEffect, useState } from "react";
import { Container, Form, Table } from "react-bootstrap";
// React Route
import { Link } from "react-router-dom";
// Font Awsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons'

const SORT = {
    NONE: "NONE",
    ASC: "ASC",
    DESC: "DESC"
}
const PostsPage = () => {
    const [token] = useState(localStorage.getItem("Authorization"));
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(SORT.NONE);

    useEffect(() => {
        let header = {}
        if (Boolean(token)) {
            header.Authorrization = token;
        }
        axios({
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/posts",
            headers: header
        })
            .then((res) => {
                console.log(res.data);
                setList(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
            })

        return () => {
            console.log("clear");
        }
    }, [token])

    useEffect(() => {
        let name = document.getElementsByClassName("title__col");
        name = [...name];

        let pattern = new RegExp(`${search}`, "gi")
        
        if (!Boolean(search)) {
            pattern = null;
        }

        name.forEach(paragraph => {
            paragraph.innerHTML = paragraph.textContent.replace(pattern, (match) => `<mark>${match}</mark>`)
        });
    }, [search])

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

    const processList = (list) => {
        let tempList = [...list];

        if (sort === SORT.ASC) {
            tempList.sort((itemA, itemB) => {
                if (itemA.title > itemB.title) return 1;
                if (itemA.title < itemB.title) return -1;
                return 0;
            })
        }
        if (sort === SORT.DESC) {
            tempList.sort((itemA, itemB) => {
                if (itemA.title > itemB.title) return -1;
                if (itemA.title < itemB.title) return 1;
                return 0;
            })
        }
        if (search !== "") {
            return tempList.filter(item => {
                return item.title.includes(search.toLowerCase());
            })
        }
        return tempList;
    }



    const finalList = processList(list);

    const handleSort = (event) => {
        if (sort === SORT.NONE) setSort(SORT.ASC);
        if (sort === SORT.ASC) setSort(SORT.DESC);
        if (sort === SORT.DESC) setSort(SORT.NONE);
    }

    


    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    return (
        <Container className="p-0">
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Search here" onChange={handleSearch} />
                </Form.Group>
            </Form>
            <Table hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th onClick={handleSort}>Title - {sort}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {finalList.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td className="title__col">{item.title}</td>
                                <td>
                                    <div className="d-flex gap-3">
                                        <Link to={"/post/" + item.id} className="btn btn-primary">
                                            <FontAwesomeIcon icon={faEye} />
                                        </Link>

                                        <button className="btn btn-danger" onClick={() => {
                                            setList(list.filter(listItem => {
                                                return listItem.id !== item.id;
                                            }))
                                        }} >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    </div>
                                </td>
                            </tr>)
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default PostsPage;