import { Container, Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders)

  return (
    <main>
      <Container>
        <h2>Order Lists:</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data || error.error}</Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
                {orders.map((order) => {
                    return <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.user?.name || "user not found"}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>{
                            order.isPaid ? order.paidAt.substring(0, 10) : (
                                <FaTimes style={{color: "red"}} />
                            )   
                        }</td>
                        <td>{
                            order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                <FaTimes style={{color: "red"}} />
                            )   
                        }</td>
                        <td>
                        <Link className="text-decoration-none text-dark" to={`/orders/${order._id}`}>Details</Link>
                      </td>
                    </tr>
                })}
            </tbody>
          </Table>
        )}
      </Container>
    </main>
  );
};

export default OrderListScreen;
