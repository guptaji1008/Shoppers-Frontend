import React from "react";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productApiSlice";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: topProducts, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data || error.error}</Message>
  ) : (
    <>
      <Carousel pause="hover" className="bg-primary mb-4">
        {topProducts.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <div className="d-flex justify-content-center" style={{backgroundColor: "whitesmoke"}}>
                <Image src={product.image.url} alt={product.name} fluid />
              </div>
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} ₹{product.price}
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default ProductCarousel;
