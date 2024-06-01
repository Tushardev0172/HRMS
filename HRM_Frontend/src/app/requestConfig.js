import axios from 'axios';

const getToken = async (name) => {
  const cookie = document.cookie;
  const token = cookie.split(`${name}=`)
  if (token.length === 2) return token.pop().split(';').shift()
  return true;
};

const postDataWithToken = async (url, values) => {
  try {
    const token = await getToken('token');
    if (token === true) {
      return
    }
    const headers = {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    };
    // console.log(1);
    const response = await axios.post(url, values, { headers });
    // console.log(2);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch data : ', error);
  }
};

const getDataWithToken = async (url) => {
  try {
    const token = await getToken('token');
    if (token === true) {
      return;
    }
    const headers = {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch data : ', error);
  }
};


const postDataWithoutToken = async (url, values) => {
  try {
    const response = await axios.post(url, values);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch data : ', error);
  }
};

export { postDataWithToken, getDataWithToken, postDataWithoutToken }
