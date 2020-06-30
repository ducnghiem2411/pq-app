import React, { useState, useEffect, useContext } from 'react'
import axios from '../../axios/axios'
import { Form, Button, Alert, Modal, Spinner } from 'react-bootstrap'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import ChoosingCard from '../layout/ChoosingCard'
import QuestionForm from '../layout/QuestionForm'
import { getQuestion, getQuestion2 } from '../../api/getQuestion'
import { getResult } from '../../api/getResult'
import AuthContext from '../../contexts/AuthContext'


const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className='timer'>Time's up!</div>
  }
  return (
    <div className='timer'>
      <div className='text'>Remaining</div>
      {remainingTime <= 60 ? (
        <div className='value'>{remainingTime}</div>
      ) : (
        <div className='value'>{Math.floor(remainingTime / 60)}</div>
      )}
      {remainingTime <= 60 ? (
        <div className='text'>seconds</div>
      ) : (
        <div className='text'>minutes</div>
      )}
    </div>
  )
}

const Practice = () => {
  const { authContext } = useContext(AuthContext)

  //Get questions states
  const [data, setData] = useState([])
  const [isChoosing, setIsChoosing] = useState(true)
  const [getQuestionParams, setGetQuestionParams] = useState({
    subject: null,
    amount: null,
    token: null
  })
  const [limitedModal, setLimitedModal] = useState(false)
  const [spinnerState, setSpinnerState] = useState(false)

  //Submitted form state
  const [resultArray, setResultArray] = useState([])
  const [buttonState, setButtonState] = useState(false)

  //Get result states
  const [loading, setLoading] = useState(false)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [practicePoint, setPracticePoint] = useState(null)

  //change array data to expected array
  function customMap(arr) {
    let returnArr = []
    for (let i = 0; i < arr.length; i++) {
      let obj = {
        _id: arr[i]._id,
        userResult: ''
      }
      returnArr.push(obj)
    }
    return returnArr
  }

  useEffect(() => {
    if (isChoosing == false) {
      setSpinnerState(true)
      axios.post(
        '/test/getQuestion',
        {
          subject: getQuestionParams.subject,
          amount: getQuestionParams.amount
        },
        {
          headers: {
            Authorization: 'Bearer ' + getQuestionParams.token || ''
          }
        }
      )
        .then(function(res) {
          setData(res.data)
          setResultArray(customMap(res.data))
          setSpinnerState(false)
        })
        .catch(function(err) {
          setLimitedModal(true)
          setSpinnerState(false)
          setIsChoosing(true)
        })
    }
  }, [isChoosing])

  useEffect(() => {
    async function fetchGetResult() {
      if (loading === true) {
        let data = await getResult(
          getQuestionParams.subject,
          getQuestionParams.amount,
          resultArray,
          authContext ? authContext.token : ''
        )
        setPracticePoint(data)
        setResultModalVisible(true)
        setLoading(false)
      }
    }
    fetchGetResult()
  }, [loading])

  const handleSubmit = e => {
    e.preventDefault()
    setButtonState(true)
    setLoading(true)
  }

  const handleClick = (sub, amt) => {
    setGetQuestionParams({
      subject: sub,
      amount: amt,
      token: authContext ? authContext.token : ''
    })
    setIsChoosing(false)
  }

  const forceSubmit = () => {
    setButtonState(true)
    setLoading(true)
  }

  const handleChange = index => e => {
    let newArr = [...resultArray] // copy the old data array
    newArr[index].userResult = e.target.value // replace the field by index
    setResultArray(newArr) // replacing the old array
  }

  return (
    <>
      {isChoosing ? (
        <div className='d-flex justify-content-around'>
          <ChoosingCard
            imgSrc='math.jpg'
            subject='Maths'
            amount='10'
            handleClick={() => handleClick('math', 10)}
          />
          <ChoosingCard
            imgSrc='physics.jpg'
            subject='Physics'
            amount='10'
            isDisable={true}
            handleClick={() => handleClick('physics', 10)}
          />
          <ChoosingCard
            imgSrc='english.jpg'
            subject='English'
            amount='10'
            isDisable={true}
            handleClick={() => handleClick('english', 10)}
          />
        </div>
      ) : (
        <></>
      )}

      {spinnerState ? (
        <>
          <h2 className='font-weight-bold my-5'>Loading</h2>
          <Spinner animation='border' variant='primary' />
        </>
      ) : (
        <></>
      )}

      <Modal show={limitedModal} centered>
        <Modal.Body className='alert-danger text-center'>
          <Alert>
            <Alert.Heading variant='danger'>
              You reached the limit
            </Alert.Heading>
            <p>You can only do 3 practices per day</p>
            <p>Please visit us at tomorrow ;)</p>
          </Alert>
          <Button
            variant='danger'
            size='sm'
            onClick={() => setLimitedModal(false)}
          >
            Confirm
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={resultModalVisible} centered>
        <Modal.Body className='alert-success text-center'>
          <Alert>
            <Alert.Heading variant='success'>Congrats!!</Alert.Heading>
            <p>You scored {practicePoint}</p>
            {authContext ? (
              <p>You can see your points at Your Results page</p>
            ) : (
              <p>You need to login to save your point</p>
            )}
          </Alert>
          <Button
            variant='success'
            size='sm'
            onClick={() => setResultModalVisible(false)}
          >
            Confirm
          </Button>
        </Modal.Body>
      </Modal>

      {data.length !== 0 ? (
        <div className='w-100'>
          <div className='float-right fixed-top ml-10 timer-container'>
            <CountdownCircleTimer
              isPlaying={!buttonState}
              duration={300}
              colors={[['#004777', 0.33]]}
              onComplete={() => {
                forceSubmit()
                return [false, 1]
              }}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>

          <Form className='float-left' onSubmit={handleSubmit}>
            {data.map((q, index) => (
              <QuestionForm
                key={index}
                id={q._id}
                handleChange={handleChange(index)}
                title={`${index + 1}. ${q.title}`}
                option1={q.options[0]}
                option2={q.options[1]}
                option3={q.options[2]}
                option4={q.options[3]}
              />
            ))}
            <Form.Group>
              <Button disabled={buttonState} type='submit'>
                Submit
              </Button>
            </Form.Group>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Practice

// async function fetchData() {
//   setSpinnerState(true)
//   const responseData = await getQuestion(
//     getQuestionParams.subject,
//     getQuestionParams.amount,
//     getQuestionParams.token
//   )
//   if (!responseData) {
//     setLimitedModal(true)
//     setSpinnerState(false)
//     setIsChoosing(true)
//   }
//   await setData(responseData)
//   await setResultArray(customMap(responseData))
//   setSpinnerState(false)
// }
// fetchData()
