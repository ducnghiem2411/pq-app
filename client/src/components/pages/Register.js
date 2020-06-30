import React, { useState, useEffect } from 'react'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import axios from '../../axios/axios'

const validateSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username length must be greater than 3')
    .max(15, 'Username length must be shorter than 15')
    .required('Username is required'),
  password: yup
    .string()
    .min(6, 'Username length must be greater than 6')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirm password not matched')
    .required('Confirm password is required')
})

const Register = () => {
  const [apiData, setApiData] = useState({
    loading: false,
    result: null,
    error: null
  })

  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [failureModalVisible, setFailureModalVisible] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validateSchema,
    onSubmit: values => {
      setApiData({
        loading: true,
        error: null,
        result: null
      })
      axios
        .post('/auth/register', {
          username: values.username,
          password: values.password
        })
        .then(res => {
          setApiData({
            loading: false,
            error: null,
            result: res.data
          })
        })
        .catch(err => {
          setApiData({
            loading: false,
            error: err,
            result: null
          })
        })
    }
  })

  useEffect(() => {
    if (apiData.result !== null) {
      setSuccessModalVisible(true)
    }
  }, [apiData.result])

  useEffect(() => {
    if (apiData.error !== null) {
      setFailureModalVisible(true)
    }
  }, [apiData.error])

  const history = useHistory()
  const moveToLogin = () => {
    history.push('/login')
  }

  return (
    <div className='w-25'>
      <Modal show={successModalVisible} centered>
        <Modal.Body className='alert-success text-center'>
          <Alert>
            <Alert.Heading variant='success'>Registered!</Alert.Heading>
            <p>Your registration is successful</p>
          </Alert>
          <Button
            variant='success'
            size='sm'
            onClick={() => setSuccessModalVisible(false)}
          >
            Confirm
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={failureModalVisible} centered>
        <Modal.Body className='alert-danger text-center'>
          <Alert>
            <Alert.Heading variant='danger'>Something went wrong</Alert.Heading>
            {apiData.error && <p>{apiData.error.message}</p>}
          </Alert>
          <Button
            variant='danger'
            size='sm'
            onClick={() => setFailureModalVisible(false)}
          >
            Confirm
          </Button>
        </Modal.Body>
      </Modal>

      <h4 className='my-3 text-center'>Register</h4>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            name='username'
            autoComplete='off'
            value={formik.values.username}
            onChange={formik.handleChange}
            isInvalid={Boolean(formik.errors.username)}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            name='password'
            isInvalid={Boolean(formik.errors.password)}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type='password'
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            name='confirmPassword'
            isInvalid={Boolean(formik.errors.confirmPassword)}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {formik.errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Button block type='submit' disabled={apiData.loading}>
            Register
          </Button>
          <Form.Text>
            Already have an account?
            <a onClick={moveToLogin} href=''> Login now</a>
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Register
