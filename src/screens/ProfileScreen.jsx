import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useProfileMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { FaTimes } from 'react-icons/fa'
import Meta from "../components/Meta";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = profileInfo;

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setProfileInfo({
        ...profileInfo,
        name: userInfo.name,
        email: userInfo.email,
      });
    } else {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password not matched");
    } else {
      try {
        const res = await updateProfile({ name, email, password }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data || error.error);
      }
    }
  };

  return (
    <main>
      <Meta title="Profile summary" />
      <Container>
        <Row>
          <Col md={3} sm={12}>
            <h2>User Profile</h2>
            <Form className="my-4" onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>
                  {" "}
                  <strong>Name</strong>{" "}
                </Form.Label>
                <Form.Control
                  type="name"
                  name="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email" className="my-2">
                <Form.Label>
                  {" "}
                  <strong>Email address</strong>{" "}
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="password" className="my-2">
                <Form.Label>
                  {" "}
                  <strong>Password</strong>{" "}
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="my-2">
                <Form.Label>
                  {" "}
                  <strong>Confirm Password</strong>{" "}
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" variant="dark" className="my-3">
                Update Profile
              </Button>
              {loadingUpdateProfile && <Loader />}
            </Form>
          </Col>
          <Col md={9} sm={12}>
            <h2>My Orders</h2>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        <Link className="text-decoration-none text-dark" to={`/orders/${order._id}`}>Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProfileScreen;
