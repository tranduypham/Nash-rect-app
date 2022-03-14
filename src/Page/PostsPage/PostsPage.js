// Axios
import axios from "axios";

import React, { useEffect, useState, useContext } from "react";
import { Container, Form, Table } from "react-bootstrap";
// React Route
import { Link } from "react-router-dom";
// Font Awsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../App";

const SORT = {
  NONE: "NONE",
  ASC: "ASC",
  DESC: "DESC"
};
// NOTE[#2]: for functions that do not directly access to component
// function state or variables, please move that function out of
// component function

// RESOLVED[#2]: Move the function out of the component function
const hightlightText = (paragraph, textNeedHighlight) => {
  // Must have () bracket, or else hightlight text won't not be include in spilt text. global, ignor case
  let pattern = new RegExp(`(${textNeedHighlight})`, "gi");
  if (!Boolean(textNeedHighlight)) {
    pattern = null;
  }
  const parts = paragraph.split(pattern);
  return parts.map((part) =>
    part.toLowerCase() === textNeedHighlight.toLowerCase() ? (
      <mark>{part}</mark>
    ) : (
      part
    )
  );
};
const PostsPage = () => {
//   const [token] = useState(localStorage.getItem("Authorization"));
  const [token, setToken] = useContext(Context);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT.NONE);

  // RESOLVED[#1]: Put Axios in seperate function
  const fetchData = ({ header = {} }) => {
    axios({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts",
      headers: header
    })
      .then((res) => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  // NOTE[#1]: axios should not be called directly here, you should create a separate function
  // to wrap that, in case, for example, we want to change the http client in the future
  // or we need to automatically insert the token in to request header
  useEffect(() => {
    let header = {};
    if (Boolean(token)) {
      header.Authorrization = token;
    }
    // axios({
    //     method: "GET",
    //     url: "https://jsonplaceholder.typicode.com/posts",
    //     headers: header
    // })
    //     .then((res) => {
    //         console.log(res.data);
    //         setList(res.data);
    //         setLoading(false);
    //     })
    //     .catch(() => {
    //         setError(true);
    //     })
    fetchData(header);

    return () => {
      console.log("clear");
    };
  }, [token]);

  if (isError) {
    return (
      <div>
        <h1 className="text-danger">Error...</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div>
        <h1>LOADING...</h1>
      </div>
    );
  }

  const processList = (list) => {
    let tempList = [...list];

    if (sort === SORT.ASC) {
      tempList.sort((itemA, itemB) => {
        if (itemA.title > itemB.title) return 1;
        if (itemA.title < itemB.title) return -1;
        return 0;
      });
    }
    if (sort === SORT.DESC) {
      tempList.sort((itemA, itemB) => {
        if (itemA.title > itemB.title) return -1;
        if (itemA.title < itemB.title) return 1;
        return 0;
      });
    }
    if (search !== "") {
      return tempList.filter((item) => {
        return item.title.includes(search.toLowerCase());
      });
    }
    return tempList;
  };

  const finalList = processList(list);

  const handleSort = (event) => {
    if (sort === SORT.NONE) setSort(SORT.ASC);
    if (sort === SORT.ASC) setSort(SORT.DESC);
    if (sort === SORT.DESC) setSort(SORT.NONE);
  };

  // There is a "bug" with this search funciton
  // if you enter an uppercase letter, it will then turn lowwercase
  // character in result to uppercase :))
    //RESOLVE: Resolve this bug by adjust the hight light function a bit   
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

//   RESOLVED[Note]: Separate the event handler into a function
  const handleDelete = (id) => {
    setList(
        list.filter((listItem) => {
          return listItem.id !== id;
        })
      );
  }
  return (
    <Container className="p-0">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Search here"
            onChange={handleSearch}
          />
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
                <td className="title__col">
                  {hightlightText(item.title, search)}
                </td>
                <td>
                  <div className="d-flex gap-3">
                    <Link to={"/post/" + item.id} className="btn btn-primary">
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    {/* Note: this logic is ok, but for this kind of processing*/}
                    {/* it it recommanded to put it in a separate function */}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        // setList(
                        //   list.filter((listItem) => {
                        //     return listItem.id !== item.id;
                        //   })
                        // );
                        handleDelete(item.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default PostsPage;
