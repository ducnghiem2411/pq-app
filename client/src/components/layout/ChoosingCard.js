import React from 'react'
import { Button, Card } from 'react-bootstrap'

const ChoosingCard = ({subject, amount, imgSrc, isDisable, handleClick}) => {

  return (
    <Card className='text-center mr-3' style={{ width: '15rem' }}>
      <Card.Img variant="top" src={process.env.PUBLIC_URL + '/'+imgSrc} />
      <Card.Body>
        <Card.Title>{`${subject} - ${amount/2} mins`}</Card.Title>
        <Card.Text>{`Total questions: ${amount}`}</Card.Text>
        <Button disabled={isDisable} variant='primary' onClick={handleClick}>
          Practice!
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ChoosingCard
