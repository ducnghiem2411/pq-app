import axios from "../axios/axios";

export const getRank = async () => {
    const res = await axios.get('/user/ranking')
    return res.data
}