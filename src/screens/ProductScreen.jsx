import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Image,
  Row,
  ListGroup,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import Ratings from "../components/Ratings";
import { useGetProductDetailsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);

  // Recieving id from the url
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const response = useGetProductDetailsQuery(id);

  console.log(response)

  const { data: product, isLoading, error } = response

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <main>
      <Container>
        <Button className="btn-margin" variant="light">
          <Link className="link" to="/">
            Go Back
          </Link>
        </Button>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data || error.error}</Message>
        ) : (
          <>
            <Row>
              <Col md={5} sm={12} className="md:mb-0 mb-4">
                <Image src={product.image} fluid />
              </Col>
              <Col md={4} sm={12} className="md:mb-0 mb-4">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Ratings
                      value={product.rating}
                      comment={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3} sm={12} className="md:mb-0 mb-4">
                <Card>
                  <ListGroup>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
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
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button
                        type="button"
                        disabled={!product.countInStock}
                        variant="dark"
                        onClick={handleAddToCart}
                      >
                        Add to cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </main>
  );
};

export default ProductScreen;
