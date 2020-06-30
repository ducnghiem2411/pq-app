import React, { useEffect, useState } from 'react'
import { getRank } from '../../api/getRank'
import { Table, Spinner } from 'react-bootstrap'

const Home = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const res = await getRank()
      setData(res)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className='w-50'>

      {loading ? (
        <div className='text-center'>
          <h2 className='font-weight-bold my-5'>Loading ranking</h2>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <></>
      )}

      {
        loading === false ? (
        <Table hover>
          <thead>
            <tr>
              <th colSpan='3' className='text-center'>
                RANKING
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              return (
                <tr>
                  <td className='font-weight-bold'>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className='font-weight-bold'>{user.point} </span>pts
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
    </div>
  )
}

/* <p>//Ranking like this</p>
<img src={process.env.PUBLIC_URL + '/image.png'} /> */

{
  /* <tr>
  <td>1</td>
  <td>Mark</td>
  <td>Otto</td>
</tr>
<tr>
  <td>2</td>
  <td>Jacob</td>
  <td>Thornton</td>
</tr>
<tr>
  <td>3</td>
  <td>Larry the Bird</td>
  <td>@twitter</td>
</tr> */
}

export default Home
