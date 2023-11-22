import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import Meta from "../components/Meta";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id))
  }

  const handleCheckOutButton = () => {
    navigate('/login?redirect=/shipping');
  }

  return (
    <main>
      <Container>
        {!cartItems.length ? (
          <Message>
            Your cart is empty <Link to="/">Go back</Link>
          </Message>
        ) : (
          <>
          <Meta title="Cart" />
            <h2>Shopping Cart : </h2>
            <Row>
              <Col md={8} sm={12}>
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={2} sm={12} className="mb-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col
                          className="d-flex align-items-center justify-content-center mb-2"
                          md={3}
                          sm={12}
                        >
                          <Link
                            className="text-decoration-none text-secondary"
                            to={`/product/${item._id}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col
                          className="d-flex align-items-center justify-content-center mb-2"
                          md={3}
                          sm={12}
                        >
                          Price: &nbsp; <strong>₹{item.price}</strong>
                        </Col>
                        <Col
                          className="d-flex align-items-center justify-content-center mb-2"
                          md={3}
                          sm={12}
                        >
                          <Row className="d-flex align-items-center gap-3">
                            <Col md={2} sm={4}>
                              Qty:
                            </Col>
                            <Col md={8} sm={6}>
                              <Form.Control
                                as="select"
                                value={item.qty}
                                onChange={(e) =>
                                  addToCartHandler(item, Number(e.target.value))
                                }
                              >
                                {[...Array(item.countInStock).keys()].map(
                                  (x) => {
                                    return (
                                      <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                      </option>
                                    );
                                  }
                                )}
                              </Form.Control>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          className="d-flex align-items-center mb-2"
                          md={1}
                          sm={12}
                        >
                          <Button
                            className="md:w-auto w-100"
                            type="button"
                            variant="light"
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col md={4} sm={12}>
                <ListGroup>
                  <ListGroup.Item>
                    <h2>
                      Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)})
                      items
                    </h2>
                    <h5>
                      Tot. Price: ₹
                      {cartItems
                        .reduce((a, c) => a + c.qty * c.price, 0)
                        .toFixed(2)}
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type="button"
                      variant="dark"
                      disabled={!cartItems.length}
                      onClick={handleCheckOutButton}
                    >
                      Proceed to payment
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </main>
  );
};

export default CartScreen;
