import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from 'yup';

// const validate = (value) => {
//     const errors = {};
//     if(!value.email){
//         errors.email = "Required"
//     }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email)){
//         errors.email = "Invalid email address"
//     }

//     if(!value.password){
//         errors.password = "Required"
//     }else if (value.password.length < 8){
//         errors.password = "Must be more than 8 characters"
//     }

//     return errors;
// }

const STATE_LOGIN = {
    NONE: "NONE",
    FALSE: "FALSE",
    SUCCESS: "SUCCESS",
    WAITING: "WAITING"
}

const LoginPage = ({ message }) => {
    console.log("mess", message);
    const [stateLogin, setStateLogin] = useState(STATE_LOGIN.NONE);
    const [isLogin] = useState(localStorage.getItem("Authorization"));
    const navigate = useNavigate();


    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
        },

        // validate,

        validationSchema: Yup.object({
            email: Yup.string()
                .required("Required")
                .email("Invalid email address"),

            password: Yup.string()
                .required("Required")
                .min(8, "Must be more than 8 characters")
        }),

        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            setStateLogin(STATE_LOGIN.WAITING);
            axios({
                method: "GET",
                url: "https://60dff0ba6b689e001788c858.mockapi.io/tokens"
            }).then(res => {
                setStateLogin(STATE_LOGIN.SUCCESS);
                const { token, userId } = res.data;
                localStorage.setItem("Authorization", String(token));
                localStorage.setItem("UserId", String(userId));
                setTimeout(() => {
                    navigate("/profile");
                    // window.location.reload();
                }, 1000);
            }).catch(() => {
                setStateLogin(STATE_LOGIN.FALSE);
            })
        },
    });

    if (Boolean(isLogin)) {
        return (
            <Navigate replace to="/profile"></Navigate>
        );
    }

    return (
        <Container className="p-0">
            <Row>
                <Col md={5}>
                    {Boolean(message) && <Alert variant="danger">{message}</Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                name="email"
                                {...formik.getFieldProps("email")}
                            // onBlur={formik.handleBlur}
                            // onChange={formik.handleChange}
                            // value={formik.values.email}
                            />
                            <small className="form-text text-danger">{formik.touched.email && formik.errors.email}</small>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                name="password"
                                {...formik.getFieldProps("password")}
                            // onBlur={formik.handleBlur}
                            // onChange={formik.handleChange}
                            // value={formik.values.password}
                            />
                            <small className="form-text text-danger">{formik.touched.password && formik.errors.password}</small>
                        </div>

                        <button type="submit" disabled={stateLogin === STATE_LOGIN.WAITING} className="btn btn-primary">
                            {stateLogin === STATE_LOGIN.WAITING ? "Please wait ..." : "Submit"}
                        </button>
                        <div className="mt-3">
                            {
                                stateLogin === STATE_LOGIN.SUCCESS ?
                                    <p className="text-success">Login success</p> :
                                    stateLogin === STATE_LOGIN.FALSE ?
                                        <p className="text-danger">Login false</p> :
                                        ""
                            }
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;