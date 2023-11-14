import React from "react";
import { Badge, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header>
      {/* creating navbar using bootstrap component */}
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Shopper&apos;s</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="d-flex align-items-center gap-1">
                  <FaShoppingCart /> <span>Cart</span>{" "}
                  <Badge variant="secondary">{cartItems.reduce((a, c) => a + c.qty, 0)}</Badge>
                </Nav.Link>
              </LinkContainer>
              {
                !userInfo ? (<LinkContainer to="/login">
                <Nav.Link className="d-flex align-items-center gap-1">
                  <FaUser /> <span>Login</span>
                </Nav.Link>
              </LinkContainer>) : (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>LogOut</NavDropdown.Item>
                </NavDropdown>
              )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
