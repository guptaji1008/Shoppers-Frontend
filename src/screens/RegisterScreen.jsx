import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/usersApiSlice.js'
import { setCredentials } from '../slices/authSlice.js'
import { toast } from 'react-toastify'
import Meta from "../components/Meta.jsx";


const RegisterScreen = () => {
  const [userLoginInfo, setUserLoginInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await register(userLoginInfo).unwrap();
      dispatch(setCredentials({...res}))
      navigate(redirect)
    } catch (error) {
        toast.error(error?.data || error.error);
    }
  };

  return (
    <main>
      <Meta title="Register to Shopper's" />
      <FormContainer>
        <h2>Register (ufff, this paperwork!! 😣)</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="john@email.com"
              value={userLoginInfo.name}
              onChange={(e) =>
                setUserLoginInfo({
                  ...userLoginInfo,
                  name: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="john@email.com"
              value={userLoginInfo.email}
              onChange={(e) =>
                setUserLoginInfo({
                  ...userLoginInfo,
                  email: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="****"
              value={userLoginInfo.password}
              onChange={(e) =>
                setUserLoginInfo({
                  ...userLoginInfo,
                  password: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={isLoading} className="mb-3">Wasted my time 😒, Register now</Button>
        </Form>
        <div>Already on Shopper&apos;s <Link to={redirect ? `/login?redirect=${redirect}` : '/register'} >Login</Link> </div>
        <div className="d-flex justify-content-center mt-3"> {isLoading ? <Loader /> : null} </div>
      </FormContainer>
    </main>
  );
};

export default RegisterScreen;
