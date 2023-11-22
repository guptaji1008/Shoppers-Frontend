import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
import Meta from '../components/Meta'

const ShippingScreen = () => {
  
  const { shippingAddress } = useSelector((state) => state.cart)
  const userInfo = localStorage.getItem('userInfo')
  const { cartItems } = JSON.parse(localStorage.getItem('cart'))

  const [userShippingAddress, setUserShippingAddress] = useState(shippingAddress || {
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress(userShippingAddress))
    navigate('/payment')
  }

  useEffect(() => {
    if (!userInfo) navigate('/login')
    if (!cartItems.length) navigate('/')
  }, [userInfo, cartItems, navigate])

  return (
    <main>
      <Meta title="Shipping" />
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h2 className='mt-4'>Shipping Address</h2>
        <Form className='my-4' onSubmit={submitHandler}>
          <Form.Group controlId="address" className="my-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="d-block, Big Street, NewYork"
              value={userShippingAddress.address}
              onChange={(e) =>
                setUserShippingAddress({
                  ...userShippingAddress,
                  address: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="New York"
              value={userShippingAddress.city}
              onChange={(e) =>
                setUserShippingAddress({
                  ...userShippingAddress,
                  city: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="postalcode" className="my-2">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="123456"
              value={userShippingAddress.postalCode}
              onChange={(e) =>
                setUserShippingAddress({
                  ...userShippingAddress,
                  postalCode: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="postalcode" className="my-2">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="USA"
              value={userShippingAddress.country}
              onChange={(e) =>
                setUserShippingAddress({
                  ...userShippingAddress,
                  country: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="my-3">Save Address</Button>
        </Form>
      </FormContainer>
    </main>
  )
}

export default ShippingScreen
