import axios from "axios"

const axiosClient =  axios.create({
    baseURL: "https://code-crack-1.onrender.com/",
    // baseURL: 'http://192.168.217.174:3000',

    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

