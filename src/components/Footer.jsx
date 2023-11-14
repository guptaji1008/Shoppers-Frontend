import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'

const Footer = () => {
    const fullYear = new Date().getFullYear()
  return (
    <footer>
      <Container>
        <Row>
            <Col className='text-center py-3'>
                CopyRight &copy; {fullYear}
            </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
