import React, { useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from '../../axios/axios'
import AuthContext from '../../contexts/AuthContext'

const AddQuestion = () => {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [d, setD] = useState('')
  const [subject, setSubject] = useState('math')
  const [title, setTitle] = useState('')
  const [result, setResult] = useState('')

  const { authContext } = useContext(AuthContext)


  const isValidForm = (title, result, a, b, c, d) => {
    if (result !== a && result !== b && result !== c && result !== d) {
      return false
    } else if (
      result === '' ||
      title === '' ||
      a === '' ||
      b === '' ||
      c === '' ||
      d === ''
    ) {
      return false
    }
    return true
  }
  const handleSubmit = evt => {
    evt.preventDefault()
    if (isValidForm(title, result, a, b, c, d) && authContext) {
      axios.post('/test/addQuestion',
          {
            subject: subject,
            title: title,
            options: [a, b, c, d],
            result: result
          },
          {
            headers: {
              Authorization: 'Bearer ' + authContext.token
            }
          }
        )
        .then(res => res.data)
        .catch(res => res.err)
    } else {
      alert('Invalid form')
    }
  }

  return (
    <Form className='w-50 mb-5' onSubmit={handleSubmit}>
      <h4 className='text-center my-3'>Add a question</h4>
      <Form.Group>
        <Form.Label>Choose subject</Form.Label>
        <Form.Control
          onChange={e => setSubject(e.target.value)}
          as='select'
          name='subject'
        >
          <option value='math'>Math</option>
          <option value='english'>English</option>
          <option value='physics'>Physics</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Question content</Form.Label>
        <Form.Control
          onChange={e => setTitle(e.target.value)}
          name='title'
          type='text'
          placeholder='Enter the question content'
          as='textarea'
          rows='2'
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Question options</Form.Label>
        <Form.Control
          type='text'
          placeholder='Option 1'
          onChange={e => {
            setA(e.target.value)
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control
          type='text'
          placeholder='Option 2'
          onChange={e => {
            setB(e.target.value)
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control
          type='text'
          placeholder='Option 3'
          onChange={e => {
            setC(e.target.value)
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control
          type='text'
          placeholder='Option 4'
          onChange={e => {
            setD(e.target.value)
          }}
        />
      </Form.Group>

      <Form.Group sm={3}>
        <Form.Label>Question result</Form.Label>
        <Form.Control
          onChange={function(e) {
            setResult(e.target.value)
          }}
          placeholder='Please enter exact the result'
          type='text'
        ></Form.Control>
      </Form.Group>

      <Button block type='submit'>
        Submit
      </Button>
    </Form>
  )
}

export default AddQuestion
