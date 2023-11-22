import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import Meta from "../components/Meta";


const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { shippingAddress, cartItems } = JSON.parse(localStorage.getItem('cart'))

  useEffect(() => {
    if (!cartItems.length) navigate('/')
    if (!shippingAddress) navigate('/shipping')
  }, [shippingAddress, cartItems, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <main>
      <Meta title="Payment" />
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h2>Payment Method</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Label as="legend">Select Method</Form.Label>
          <Row>
            <Form.Group>
              <Col>
                <Form.Check
                  type="radio"
                  className="my-2"
                  label="PayPal or Credit Card"
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Row>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </main>
  );
};

export default PaymentScreen;
