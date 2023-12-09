import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Meta from "../components/Meta";

const OrderScreen = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const response = useGetOrderDetailsQuery(orderId);

  const { data: order, refetch, isLoading, error } = response;

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successfull");
      } catch (error) {
        toast.error(error?.data || error?.error);
      }
    });
  };

  const onError = (err) => toast.error(err.message);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => orderId);
  };

  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successfull");
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order Delivered");
    } catch (error) {
      toast.error(error?.data || error.error);
    }
  };

  return (
    <main>
      <Container>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data || error.error}</Message>
        ) : (
          <>
          <Meta title="Order Summary" />
            <h2>Your Orders</h2>
            <Row>
              <Col md={8} sm={12}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3 className="mb-2">Shipping:</h3>
                    <p>
                      <strong>OrderId: &nbsp; </strong> {orderId}
                    </p>
                    <p>
                      <strong>Name: &nbsp; </strong> {order.user.name}
                    </p>
                    <p>
                      <strong>Email: &nbsp; </strong> {order.user.email}
                    </p>
                    <p>
                      <strong>Address: &nbsp; </strong>
                      {order.shippingAddress.address} ,
                      {order.shippingAddress.city} ,
                      {order.shippingAddress.postalCode} ,
                      {order.shippingAddress.country}
                    </p>
                    {!order.isDelivered ? (
                      <Message variant="danger">
                        <strong>Not Delivered</strong>
                      </Message>
                    ) : (
                      <Message>
                        <strong>Delivered</strong> on {order.deliveredAt}
                      </Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3 className="mb-2">Payment:</h3>
                    <p>
                      <strong>Method: &nbsp; </strong> {order.paymentMethod}
                    </p>
                    {!order.isPaid ? (
                      <Message variant="danger">
                        <strong>Not Paid</strong>
                      </Message>
                    ) : (
                      <Message>
                        <strong>Paid</strong> on {order.paidAt}
                      </Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2 className="mb-2">Order Items:</h2>
                    <ListGroup>
                      {order.orderItems.map((item) => (
                        <ListGroup.Item key={item._id}>
                          <Row>
                            <Col md={2} sm={12} className="mb-2">
                              <Image
                                src={item.image.url}
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
                              {item.qty} x ₹{item.price} = ₹
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4} sm={12}>
                <Card>
                  <ListGroup>
                    <ListGroup.Item>
                      <h3>Order Summary</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p>
                        <strong>Item Price :</strong> ₹{order.itemsPrice}
                      </p>
                      <p>
                        <strong>Shipping :</strong> ₹{order.shippingPrice}
                      </p>
                      <p>
                        <strong>Tax :</strong> ₹{order.taxPrice}
                      </p>
                      <p>
                        <strong>Total :</strong> ₹{order.totalPrice}
                      </p>
                    </ListGroup.Item>
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {isPending ? (
                          <Loader />
                        ) : (
                          <div>
                            <div>
                              <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                              ></PayPalButtons>
                            </div>
                          </div>
                        )}
                      </ListGroup.Item>
                    )}
                    {loadingDeliver && <Loader />}
                    {userInfo &&
                      userInfo.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <ListGroup.Item>
                          <Button
                            type="button"
                            className="btn btn-block"
                            variant="dark"
                            onClick={deliverOrderHandler}
                          >
                            Mark as Delivered
                          </Button>
                        </ListGroup.Item>
                      )}
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

export default OrderScreen;
