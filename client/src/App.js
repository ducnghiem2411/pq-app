import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import axios from './axios/axios'
import AppBar from './components/layout/AppBar'
import Login from './components/pages/Login'
import Home from './components/pages/Home'
import Register from './components/pages/Register'
import Practice from './components/pages/Practice'
import AddQuestion from './components/pages/AddQuestion'
import AuthContext from './contexts/AuthContext'
import YourResults from './components/pages/YourResults'

function App() {
  const [authContext, setAuthContext] = useState(null)

  useEffect(() => {
    if (!authContext) {
      const jwt = localStorage.getItem('jwt')
      if (jwt) {
        axios
          .get('/auth/updateAuth', {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then(res => {
            setAuthContext(res.data)
          })
      }
    }
  }, [authContext])

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
        <AppBar />
        <Container className='d-flex align-items-center flex-column'>
          <Route path='/practice' component={Practice} />
          <Route exact path='/' component={Home} />
          <Route path='/detail' component={YourResults} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/addquestion' component={AddQuestion} />
        </Container>
    </AuthContext.Provider>
  )
}

export default App
