import { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../slices/productApiSlice.js";
import { LinkContainer } from "react-router-bootstrap";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      const { name, price, image, brand, category, countInStock, description } =
        product;
      setProductInfo({
        ...productInfo,
        name,
        price,
        image: image.url,
        brand,
        category,
        countInStock,
        description,
      });
    }
  }, [product]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ ...productInfo, _id: productId });
      refetch();
      toast.success("Product Updated");
      navigate("/admin/productlist");
    } catch (error) {
      toast.error(error?.data || error.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData()
    formData.append('productImage', e.target.files[0]);
    try {
        const res = await uploadProductImage({ formData, _id: productId }).unwrap();
        toast.success(res.message)
        setProductInfo({...productInfo, image: res.image.url})
    } catch (error) {
        console.log(error)
        toast.error(error?.data || error.error);
    }
  };

  return (
    <main>
      <Container>
        <LinkContainer to="/admin/productlist">
          <Button type="button" variant="light">
            Go Back
          </Button>
        </LinkContainer>
        <FormContainer>
          <h2>Edit Product</h2>
          {loadingUpdate && <Loader />}
          {loadingUpload && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger"></Message>
          ) : (
            <Form className="my-3" onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name.."
                  value={productInfo.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Group controlId="price" className="my-2">
                  <Form.Label>
                    <strong>Price</strong>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Enter price.."
                    value={productInfo.price}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="countinstock" className="my-2">
                  <Form.Label>
                    <strong>Count in stock</strong>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="countInStock"
                    placeholder="Count"
                    value={productInfo.countInStock}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <Form.Group controlId="image" className="my-2">
                <Form.Label>
                  <strong>Image</strong>
                </Form.Label>
                <div className=" d-flex align-items-center">
                  <Form.Control
                    type="text"
                    name="image"
                    placeholder="Enter Image URL"
                    value={productInfo.image}
                    onChange={handleChange}
                  />
                  <Form.Control
                  className="ms-4"
                    type="file"
                    label="Choose file"
                    onChange={uploadFileHandler}
                  />
                </div>
              </Form.Group>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Group controlId="brand" className="my-2">
                  <Form.Label>
                    <strong>Brand</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    placeholder="Enter brand.."
                    value={productInfo.brand}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="category" className="my-2">
                  <Form.Label>
                    <strong>Category</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={productInfo.category}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <Form.Group controlId="description" className="my-2">
                <Form.Label>
                  <strong>Description</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Description"
                  value={productInfo.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" variant="dark" className="my-2">
                Update Product
              </Button>
            </Form>
          )}
        </FormContainer>
      </Container>
    </main>
  );
};

export default ProductEditScreen;
