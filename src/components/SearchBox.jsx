import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

const SearchBox = () => {

  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
        navigate(`/search/${keyword}`)
    } else {
        navigate('/')
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex align-items-center me-4'>
      <Form.Control
        type='text'
        value={keyword}
        placeholder='Search here..'
        className='me-3'
        onChange={(e) => setKeyword(e.target.value)}
     />
      <Button type='submit' variant='outline-success'>Search</Button>
    </Form>
  )
}

export default SearchBox
