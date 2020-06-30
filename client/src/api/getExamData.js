import axios from "../axios/axios";

export const getExamData = async (token) => {
    const res = await axios.get('/user/getExamData',{
        headers: {
            Authorization: 'Bearer ' + token
        }
      })
    return res.data
}
