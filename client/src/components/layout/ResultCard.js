import React from 'react'
import { Card } from 'react-bootstrap'
import Moment from 'react-moment'

const ResultCard = ({subject, point, type, time}) => {
  return (
    <Card
      border='info'
      style={{ width: '30rem', height: '12rem' }}
      className='my-5'
    >
      <Card.Header className='text-capitalize font-weight-bold'>
        {subject}
      </Card.Header>
      <Card.Body>
        <Card.Title>Point {point}</Card.Title>
        <Card.Text>
          Test type: <span className='font-weight-light'>{type}</span>
        </Card.Text>
        <Card.Text>
          Completed at:{' '}
          <Moment
            className='font-weight-light'
            fromNowDuring={86400000}
            format='HH:mm YYYY/MM/DD'
          >
            {time}
          </Moment>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ResultCard
