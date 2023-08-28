import axios from 'axios'
import { useConfigStore } from '../stores/config'
import { v4 as uuidv4 } from 'uuid'

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config) => {
    config.headers['X-Wegalaxy-Request-Id'] = uuidv4()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    const data = res.data
    if (res.status === 200) {
      let errorCode = data.errorCode ?? data.errcode
      let errorMessage = data.errorMessage ?? data.errmsg
      if (errorCode === 0) {
        let result = data.data
        return Promise.resolve(result)
      } else {
        return Promise.reject(errorMessage)
      }
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getHeaders = () => {
  let headers = {}
  let { config } = useConfigStore()
  let token = config.webArAccessToken
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (config.extraHeaderInRequest) {
    let extraHeaderInRequest = JSON.parse(config.extraHeaderInRequest)
    for (const [key, value] of Object.entries(extraHeaderInRequest)) {
      headers[key] = value
    }
  }
  return headers
}

const getAppHeaders = () => {
  let headers = {}
  let { config } = useConfigStore()
  let token = config.appAccessToken
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (config.extraHeaderInRequest) {
    let extraHeaderInRequest = JSON.parse(config.extraHeaderInRequest)
    for (const [key, value] of Object.entries(extraHeaderInRequest)) {
      headers[key] = value
    }
  }
  return headers
}

function getEventList(startIndex, pageSize) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webArBaseUrl}/event-list`,
    {
      pageInfo: {
        startIndex: startIndex,
        pageSize: pageSize
      }
    },
    {
      headers: getHeaders()
    }
  )
}

function getEventDetail(id) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webArBaseUrl}/event-get`,
    {
      id: id
    },
    {
      headers: getHeaders()
    }
  )
}

function getResult(url, eventId, longitude, latitude, inputJson) {
  return axios.post(
    url,
    {
      eventId,
      longitude,
      latitude,
      input_json: inputJson
    },
    {
      headers: getAppHeaders()
    }
  )
}

export { getEventList, getEventDetail, getResult }
