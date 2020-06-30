import React from 'react'
import { Form, FormLabel } from 'react-bootstrap/'

const QuestionForm = props => {
  const { id, title, option1, option2, option3, option4, handleChange } = props
  return (
    <Form.Group onChange={handleChange}>
      <Form.Label className='font-weight-bold'>{title}</Form.Label>
      <FormLabel className='w-100 q-label'>
      <Form.Check type='radio' name={id} label={`A. ${option1}`} value={option1} />
      </FormLabel>
      <FormLabel className='w-100 q-label'>
      <Form.Check type='radio' name={id} label={`B. ${option2}`} value={option2} />
      </FormLabel>
      <FormLabel className='w-100 q-label'>
      <Form.Check type='radio' name={id} label={`C. ${option3}`} value={option3} />
      </FormLabel>
      <FormLabel className='w-100 q-label'>      
      <Form.Check type='radio' name={id} label={`D. ${option4}`} value={option4} />
      </FormLabel>

    </Form.Group>
  )
}

export default QuestionForm
