import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import Loader from "../components/Loader";
import Message from "../components/Message.jsx";
import { useParams, useNavigate } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import Meta from "../components/Meta.jsx";

// HomeScreen component will be the homepage of the application where various products will be displayed in grid system.

const HomeScreen = () => {
  const { pageNo, keyword } = useParams();
  const navigate = useNavigate();

  const {
    data: pageInfo,
    isLoading,
    error,
  } = useGetProductsQuery({ pageNo, keyword });

  return (
    <main>
      <Container>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {console.log(error)}
          </Message>
        ) : (
          <>
            {!keyword ? <ProductCarousel /> : (
              <Button
                variant="light"
                onClick={() => navigate("/")}
                className="btn-sm"
              >
                Go back
              </Button>
            )}
            <Meta />
            <h1>Products list : </h1>
            <Row>
              {pageInfo.products.map((product) => {
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
            <Paginate
              pages={pageInfo.pages}
              page={pageInfo.page}
              keyword={keyword}
            />
          </>
        )}
      </Container>
    </main>
  );
};

export default HomeScreen;
