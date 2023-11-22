import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import Ratings from "../components/Ratings";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [reviewInfo, setReviewInfo] = useState({
    rating: 0,
    comment: "",
  });
  const [isMyReviewExist, setIsMyReviewExist] = useState(false);
  const [isMyReviewUpdating, setIsMyReviewUpdating] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // Recieving id from the url
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsQuery(id);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [updateReview, { isLoading: loadingUpdatedReview }] = useUpdateReviewMutation();

  const [deleteReview, { isLoading: deletingReview }] = useDeleteReviewMutation();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  useEffect(() => {
    if (product && product.reviews.length && userInfo) {
      const myReview = product.reviews.find(
        (review) => review.user === userInfo.userId
      );
      if (myReview) {
        setIsMyReviewExist(true);
        const { rating, comment } = myReview;
        setReviewInfo({ ...reviewInfo, rating, comment });
      }
    }
  }, [product, product?.reviews.length, userInfo]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isMyReviewUpdating) {
      try {
        const res = await createReview({ ...reviewInfo, _id: id });
        toast.success(res?.data?.message);
        refetch();
      } catch (error) {
        toast.error(error?.data || error.error);
      }
    } else {
      try {
        const res = await updateReview({ ...reviewInfo, _id: id });
        toast.success(res?.data?.message);
        refetch();
        setIsMyReviewUpdating(false)
      } catch (error) {
        toast.error(error?.data || error.error);
      }
    }
  };

  const handleDeleteReview = async () => {
    if (confirm('Are you sure ?')) {
      try {
        const res = await deleteReview(id);
        toast.success(res?.data?.message)
        refetch()
        setIsMyReviewExist(false)
      } catch (error) {
        toast.error(error.data || error.error)
      }
    }
  }

  const handleReviewChange = ({ target: { name, value } }) => {
    if (name === "rating") {
      setReviewInfo({ ...reviewInfo, [name]: Number(value) });
      return;
    }
    setReviewInfo({ ...reviewInfo, [name]: value });
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
          <Meta title={product.name} />
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
                  <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>
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
                          <strong>₹{product.price}</strong>
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
            <Row>
              <Col md={8} sm={12} className="mb-4">
                {!userInfo ? (
                  <Message>
                    <Link to="/login">Sign In</Link> to review
                  </Message>
                ) : (
                  <>
                    <h3>Reviews</h3>
                    {loadingProductReview && <Loader />}
                    {loadingUpdatedReview && <Loader />}
                    {deletingReview && <Loader />}
                    <>
                      {(isMyReviewExist && !isMyReviewUpdating) ? (
                        <ListGroup>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="d-flex align-items-center">
                                <strong> Rating:&nbsp;&nbsp;</strong>
                                <span>{reviewInfo.rating}&nbsp;</span>
                                <FaStar style={{ color: "yellowgreen" }} />
                              </div>
                              <div className="d-flex align-items-center">
                                <strong>Comment:</strong> &nbsp;
                                <div style={{ width: "31rem" }}>
                                  {reviewInfo.comment}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-none">
                              <Button
                                className="me-2"
                                type="button"
                                variant="light"
                                onClick={() => setIsMyReviewUpdating(true)}
                              >
                                <FaEdit />
                              </Button>
                              <Button type="button" variant="light"
                                onClick={handleDeleteReview}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      ) : (
                        <>
                          <Form onSubmit={handleReviewSubmit}>
                            <Form.Group controlId="rating" className="my-2">
                              <Form.Label>
                                <strong>Rating</strong>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="rating"
                                placeholder="Enter price.."
                                value={reviewInfo.rating}
                                onChange={handleReviewChange}
                              >
                                <option value="">Select..</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4- Very Good</option>
                                <option value="5">5- Excellent</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="comment" className="my-2">
                              <Form.Label>
                                <strong>Comment</strong>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="comment"
                                placeholder="Comment.."
                                value={reviewInfo.comment}
                                onChange={handleReviewChange}
                              />
                            </Form.Group>
                            <div className="d-flex align-items-center">
                              <Button type="submit" variant="dark" className="me-3">
                                {isMyReviewUpdating ? "Update" : "Submit"}
                              </Button>
                              {isMyReviewUpdating && (
                                <Button type="button" variant="light" onClick={() => setIsMyReviewUpdating(false)}>
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </Form>
                        </>
                      )}
                    </>
                  </>
                )}
              </Col>
              {product.reviews.length !== 0 && (
                <Col md={8} sm={12}>
                  <h3>Customers Precious Comments:</h3>
                  <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review.user}>
                        <div className="d-flex align-items-center">
                          <strong>{review.name}&nbsp;&nbsp;</strong>
                          <span>{review.rating}&nbsp;</span>
                          <FaStar style={{ color: "yellowgreen" }} />
                        </div>
                        <div>{review.comment}</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              )}
            </Row>
          </>
        )}
      </Container>
    </main>
  );
};

export default ProductScreen;
