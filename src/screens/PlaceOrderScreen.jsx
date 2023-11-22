import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { Button, Col, Container, Image, ListGroup, Row, Spinner } from "react-bootstrap";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from 'react-toastify'
import Meta from "../components/Meta";

const PlaceOrderScreen = () => {
  const userInfo = localStorage.getItem("userInfo");
  const cart = useSelector((state) => state.cart);
  const { paymentMethod, shippingAddress, cartItems, shippingPrice, taxPrice, itemsPrice, totalPrice } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (!paymentMethod) {
      navigate("/payment");
    } else if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [userInfo, paymentMethod, shippingAddress.address, navigate]);

  const response = useCreateOrderMutation();
  const [createOrder, { isLoading, error }] = response

  const handlePlaceOrderButton = async () => {
    try {
        const res = await createOrder({
            orderItems: cartItems,
            itemsPrice, shippingAddress, paymentMethod, shippingPrice, taxPrice, totalPrice
        })
        dispatch(clearCartItems())
        if (!error) navigate(`/orders/${res.data._id}`)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <main>
      <Container>
        {!cart.cartItems.length ? (
          <Message>
            Your cart is empty <Link to="/">Go to home</Link>
          </Message>
        ) : (
          <>
          <Meta title="Place Order" />
            <CheckoutSteps step1 step2 step3 step4 />
            <Row className="my-3">
              <Col md={8} sm={12}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <strong>Address: &nbsp; </strong>
                      {cart.shippingAddress.address},
                      {cart.shippingAddress.city}
                      {cart.shippingAddress.postalCode},
                      {cart.shippingAddress.country}
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <strong>Method: &nbsp; </strong>
                    {cart.paymentMethod}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Order Items</h2>
                    <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
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
                          className="d-flex align-items-center mb-2"
                          md={5}
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
                          className="d-flex align-items-center mb-2"
                          md={4}
                          sm={12}
                        >
                          {item.qty} x {item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4} sm={12}>
              <ListGroup>
                  <ListGroup.Item>
                    <h5>
                      Item Price: ₹
                      {cart.itemsPrice}
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h5>
                      Shipping: ₹
                      {cart.shippingPrice}
                    </h5>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h5>
                      Tax: ₹
                      {cart.taxPrice}
                    </h5>
                  </ListGroup.Item>
                  {error && 
                  <ListGroup.Item>
                    <Message>{error?.data || error.error}</Message>
                  </ListGroup.Item>}
                  <ListGroup.Item>
                    <Button
                      type="button"
                      variant="dark"
                      disabled={!cart.cartItems.length}
                      onClick={handlePlaceOrderButton}
                      className="d-flex align-items-center"
                    >
                      <span>Place Order</span>  {isLoading && <Spinner animation="border" role="status" style={{width: "23px", height: "23px", marginLeft: "15px"}} />}
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

export default PlaceOrderScreen;
