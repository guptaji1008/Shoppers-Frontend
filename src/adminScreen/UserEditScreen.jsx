import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery, useUpdateUserMutation
} from "../slices/usersApiSlice.js";
import { LinkContainer } from "react-router-bootstrap";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    isAdmin: "notAdmin",
  });

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      const { name, email, isAdmin } = user;
      setUserInfo({
        ...userInfo,
        name,
        email, 
        isAdmin: isAdmin ? "admin" : "notAdmin"
      });
    }
  }, [user]);

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'isAdmin') {
        if (userInfo.isAdmin === 'admin') {
            setUserInfo({ ...userInfo, isAdmin: "notAdmin" })
        } else {
            setUserInfo({ ...userInfo, isAdmin: "admin" })
        }
        return
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const res = await updateUser({...userInfo, _id: userId})
        toast.success('User updated successfully!')
        refetch()
        navigate('/admin/userlist')
    } catch (error) {
        toast.error(error?.data || error.error)
    }
  };

  return (
    <main>
      <Container>
        <LinkContainer to="/admin/userlist">
          <Button type="button" variant="light">
            Go Back
          </Button>
        </LinkContainer>
        <FormContainer>
          <h2>Edit User</h2>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger"></Message>
          ) : (
            <Form className="my-3" onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name.."
                  value={userInfo.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email" className="my-2">
                <Form.Label>
                  <strong>Email</strong>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Email.."
                  value={userInfo.email}
                  onChange={handleChange}
                />
              </Form.Group>
                <Form.Group controlId="isAdmin" className="my-2" >
                    <Form.Check
                      type="switch"
                      label="Is Admin"
                      name="isAdmin"
                      checked={userInfo.isAdmin === "admin"}
                      onChange={handleChange}
                    />
                </Form.Group>
              <Button type="submit" variant="dark" className="my-2">
                Update User
              </Button>
            </Form>
          )}
        </FormContainer>
      </Container>
    </main>
  );
};

export default UserEditScreen;
