import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useLoginMutation } from '../slices/usersApiSlice.js'
import { setCredentials } from '../slices/authSlice.js'
import { toast } from 'react-toastify'


const LoginScreen = () => {
  const [userLoginInfo, setUserLoginInfo] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation();

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
      const res = await login(userLoginInfo).unwrap();
      dispatch(setCredentials({...res}))
      navigate(redirect)
    } catch (error) {
        toast.error(error?.data || error.error);
    }
  };

  return (
    <main>
      <FormContainer>
        <h2>Login (We also hate paperwork😣)</h2>
        <Form onSubmit={submitHandler}>
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
          <Form.Group controlId="email" className="my-3">
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
          <Button type="submit" variant="primary" disabled={isLoading} className="mb-3">Login Me Now 😒</Button>
        </Form>
        <div>New to Shopper&apos;s <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} >Register</Link> </div>
        <div className="d-flex justify-content-center mt-3"> {isLoading ? <Loader /> : null} </div>
      </FormContainer>
    </main>
  );
};

export default LoginScreen;
