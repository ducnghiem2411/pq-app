import axios from '../axios/axios'

export async function getQuestion(subject, amount, token) {
  const data = await axios.post(
    '/test/getQuestion',
    {
      subject: subject,
      amount: amount
    },
    {
      headers: {
        Authorization: 'Bearer ' + token || ''
      }
    }
  )
  return data
}

export function getQuestion2(subject, amount, token) {
  axios.post(
      '/test/getQuestion',
      {
        subject: subject,
        amount: amount
      },
      {
        headers: {
          Authorization: 'Bearer ' + token || ''
        }
      }
    )
}


// .then(function (res) {
//   return res.data
// })
// .catch(function (err) {
//   console.log(err.message)
//   return err.message
// });
