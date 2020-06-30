import axios from '../axios/axios'

export const getResult = async (subject, amount, resultArray, token) => {
  const res = await axios.post('test/getResult', {
    subject : subject,
    amount : amount,
    resultArray : resultArray
  },
    {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  )
  return res.data
}
