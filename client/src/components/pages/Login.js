import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Modal, Alert } from 'react-bootstrap'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import axios from '../../axios/axios'
import AuthContext from '../../contexts/AuthContext'

const loginValidationSchema = yup.object({
  username: yup.string().required('Username is required!'),
  password: yup.string().required('Password is required!')
})

const Login = () => {
  const { authContext, setAuthContext } = useContext(AuthContext)
  const [failureModalVisible, setFailureModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const history = useHistory()
  
  const moveToRegister = () => {
    history.push('/register')
  }
  const moveToPractice = () => {
    history.push('/practice')
  }

  const [loginApiData, setLoginApiData] = useState({
    loading: false,
    error: null,
    result: null
  })

  const formik = useFormik({
    validationSchema: loginValidationSchema,
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: values => {
      setLoginApiData({
        loading: true,
        error: null,
        result: null
      })
      axios
        .post('/auth/login', {
          username: values.username,
          password: values.password
        })
        .then(res => {
          setLoginApiData({
            loading: false,
            error: null,
            result: res.data
          })
        })
        .catch(err => {
          setLoginApiData({
            loading: false,
            error: err,
            result: null
          })
          setFailureModalVisible(true)
        })
    }
  })

  useEffect(() => {
    if (loginApiData.result) {
      localStorage.setItem('jwt', loginApiData.result.token)
      setAuthContext(loginApiData.result)
      setSuccessModalVisible(true)
      setTimeout(() => {
        moveToPractice()
      }, 2000)
    }
  }, [authContext, loginApiData.result])

  return (
    <div className='w-25'>
      <h4 className='text-center my-3'>Login</h4>

      <Modal show={successModalVisible} centered>
        <Modal.Body className='alert-success text-center'>
          <Alert>
            <Alert.Heading variant='success'>Login successfully</Alert.Heading>
            <p>Happy practicing!!!</p>
          </Alert>
          <Button variant='success' size='sm' onClick={() => moveToPractice()}>
            Move to Practice
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={failureModalVisible} centered>
        <Modal.Body className='alert-danger text-center'>
          <Alert>
            <Alert.Heading variant='danger'>Something went wrong</Alert.Heading>
            {loginApiData.error && <p>{loginApiData.error.message}</p>}
          </Alert>
          <Button
            variant='danger'
            size='sm'
            onClick={() => setFailureModalVisible(false)}
          >
            Try again
          </Button>
        </Modal.Body>
      </Modal>

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            name='username'
            autoComplete='off'
            isInvalid={formik.errors.username}
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          <Form.Control.Feedback type='invalid'>
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            isInvalid={formik.errors.password}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <Form.Control.Feedback type='invalid'>
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Button block type='submit' disabled={loginApiData.loading}>
            Login
          </Button>
          <Form.Text>
            Don't have an account yet?
            <a href='' onClick={moveToRegister}> Register now</a>
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Login
