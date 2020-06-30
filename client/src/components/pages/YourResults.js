import React, { useEffect, useContext, useState } from 'react'
import ResultCard from '../layout/ResultCard'
import { getExamData } from '../../api/getExamData'
import AuthContext from '../../contexts/AuthContext'

const YourResults = () => {
  const { authContext } = useContext(AuthContext)

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const resData = await getExamData(authContext.token)
      setData(resData)
    }
    if (authContext) {
      fetchData()
    }
  }, [authContext])
  return (
    <div>
      <h4 className='text-center my-3'>Your results</h4>
      {data.map((data, index) => (
        <ResultCard
          key={index}
          subject={data.subject}
          type={data.type}
          point={data.result}
          time={data.createdAt}
        />
      ))}
    </div>
  )
}

export default YourResults
