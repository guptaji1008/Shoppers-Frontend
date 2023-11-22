import React from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetAllProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../slices/productApiSlice";
import { toast } from "react-toastify";

const ProductListScreen = () => {

  const { data: products, isLoading, error, refetch } = useGetAllProductsQuery();

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await deleteProduct(id)
        toast.success(res.data.message)
        refetch();
      } catch (error) {
        toast.error(error?.data || error.error)
      }
    }
  }

  const createProductHandler = async () => {
    if (confirm('Are you sure to create a new product ?')) {
        try {
            await createProduct().unwrap();
            refetch()
        } catch (error) {
            toast.error(error?.data || error.error)
        }
    }
  }

  return (
    <main>
      <Container>
        <div className="btn-sm d-flex align-items-center justify-content-between">
          <h2>Products</h2>
          <Button className="d-flex align-items-center" variant="dark" onClick={createProductHandler}>
            <FaEdit />
            <span className="ms-2">Add Products</span>
          </Button>
        </div>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error?.data || error.error}</Message>
        ) : (
          <>
            <Table striped hover responsive className="table-sm mt-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm mx-2">
                            <FaEdit />
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(product._id)}
                        >
                            <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </main>
  );
};

export default ProductListScreen;
