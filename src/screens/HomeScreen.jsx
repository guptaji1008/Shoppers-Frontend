import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import Loader from "../components/Loader";
import Message from "../components/Message.jsx";

// HomeScreen component will be the homepage of the application where various products will be displayed in grid system.

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <main>
      <Container>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            <h1>Products list : </h1>
            <Row>
              {products.map((product) => {
                return (
                  <Col
                    key={product._id}
                    className="py-3"
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                  >
                    <Product product={product} />
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>
    </main>
  );
};

export default HomeScreen;
