import React, { useContext } from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

const AppBar = () => {
  const { authContext, setAuthContext } = useContext(AuthContext)

  const history = useHistory()
  const moveToLogin = () => {
    history.push('/login')
  }
  const moveToRegister = () => {
    history.push('/register')
  }
  const moveToHome = () => {
    history.push('/')
  }
  const moveToPractice = () => {
    history.push('/practice')
  }
  const moveToAdd = () => {
    history.push('/addquestion')
  }
  const moveToUserDetail = () => {
    history.push('/detail')
  }

  return (
    <Navbar
      bg='light'
      className='fixed-top sticky-top shadow-sm mb-5'
      style={{ height: 80 }}
    >
      <Container>
        <Navbar.Brand onClick={moveToHome} className='brand text-primary font-weight-bold'>
          Practice Quiz
        </Navbar.Brand>
        <Nav>
          <Nav.Link className='mr-3' onClick={moveToHome}>
            Ranking
          </Nav.Link>
          <Nav.Link className='mr-3' onClick={moveToPractice}>
            Practice!
          </Nav.Link>
          {authContext && (
            <Nav.Link className='mr-3' onClick={moveToUserDetail}>
              Your results
            </Nav.Link>
          )}
          { authContext && authContext.user.username === 'admin123' && (
            <Nav.Link className='mr-3' onClick={moveToAdd}>
              Manage questions
            </Nav.Link>
          )}
          {!authContext && (
            <Nav.Link className='mr-3' onClick={moveToLogin}>
              Login
            </Nav.Link>
          )}
          {!authContext && (
            <Nav.Link className='mr-3' onClick={moveToRegister}>
              Register
            </Nav.Link>
          )}
          {authContext && (
            <NavDropdown
              className='mr-3'
              title={authContext.user.username}
              id='collasible-nav-dropdown'
            >
              <NavDropdown.Item href='' disabled>
                Setting
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  localStorage.clear()
                  setAuthContext(null)
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default AppBar
