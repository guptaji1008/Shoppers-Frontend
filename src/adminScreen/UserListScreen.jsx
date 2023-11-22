import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetUsersQuery, useDeleteUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {

  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (confirm('Are you sure ?')) {
        try {
            const res = await deleteUser(id);
            refetch();
        } catch (error) {
            toast.error(error?.data || error.error)
        }
    }
  }

  return (
    <main>
      <Container>
        <h2>Users</h2>
        {isDeleting && <Loader />}
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
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td> <a href={`mailto:${user.email}`}>{user.email}</a> </td>
                      <td>
                        {
                            user.isAdmin ? (
                                <FaCheck style={{color: 'green'}} />
                            ) : (
                                <FaTimes style={{color: 'red'}} />
                            )
                        }
                      </td>
                      <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`} >
                            <Button variant="light" className="btn-sm mx-2" >
                                <FaEdit />
                            </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(user._id)}
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

export default UserListScreen;

