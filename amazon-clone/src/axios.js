import axios from "axios"

const instance = axios.create({
    baseURL: 'https://us-central1-clone-a205d.cloudfunctions.net/api'
})

export default instance

// http://localhost:5001/clone-a205d/us-central1/api