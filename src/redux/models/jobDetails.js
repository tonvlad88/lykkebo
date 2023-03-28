import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export async function modelFetchJobDetails(userId, jobId) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');
  return fetch(`${baseUrl}/lykkebo/v1/jobdetails/overview?user_id=${userId}&job_id=${jobId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      user_id: `${userId}`,
      job_id: `${jobId}`,
    },
  })
    .then(response => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.log('error', 'modelFetchJobDetails')
    });
}

export async function modelUpdateWorkingDays(data) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.post(`${baseUrl}/lykkebo/v1/jobdetails/updateWorkingDay?user_id=${data.user_id}&job_id=${data.job_id}&date=${data.date}&toggle=${data.toggle ? 1 : 0}`, {}, axiosConfig)
    .then(res => res.data)
    .catch((error) => {
      console.log('error', error);
    });
}
