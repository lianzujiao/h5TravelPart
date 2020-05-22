import axios from 'axios';
// axios.defaults.baseURL = process.env.NODE_ENV = "deveplopment" ? "www.zghdch.com" : "";
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://www.zghdch.com"
} else {
  axios.defaults.baseURL = ""
}
axios.defaults.headers.post['Content-Type'] = 'application/json';
export function get(url, params) {
   return new Promise((resolve, reject) => {
    axios.get(url,{params:params}).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });


}
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}
