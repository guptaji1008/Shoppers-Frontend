import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Ratings from './Ratings'

// Creating a product card which will display image, price and name of the product

const Product = ({product}) => {
  return (
    <Card>
      <Link to={`product/${product._id}`}>
        <Card.Img style={{objectFit: "cover", height: "12rem"}} variant="top" src={product.image} />
      </Link>
      <Card.Body>
        <Link to={`product/${product._id}`}>
            <Card.Title className='product-title'>{product.name}</Card.Title>
        </Link>
        <Card.Text as="div">
            <Ratings value={product.rating} comment={`${product.numReviews} reviews`} />
        </Card.Text>
        <Card.Text as="h3">
        ₹{product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
