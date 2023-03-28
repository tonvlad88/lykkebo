import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export async function modelFetchTracker(userId, date) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');
  console.log(`${baseUrl}/lykkebo/v1/timerec/overview/test?user_id=${userId}&day=${date}`)
  return fetch(`${baseUrl}/lykkebo/v1/timerec/overview/test?user_id=${userId}&day=${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(responseJson => responseJson)
    .catch((error) => {
      console.log('error', 'modelFetchTracker')
    });
}

export async function modelsaveDailyNote(data) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios.post(`${baseUrl}/lykkebo/v1/timerec/submitInternalTimeRecording`, data, axiosConfig)
    .then(res => {
      // console.log('res', res)
      return res.data;
    })
    .catch((error) => {
      console.log('error', 'modelsaveDailyNote')
    });
}


export async function deleteNoteTrackerDetailsData(data) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios.post(`${baseUrl}/lykkebo/v1/timerec/delete`, data, axiosConfig)
    .then(res => res.data)
    .catch((error) => {
      console.log('error', 'modelsaveDailyNote')
    });
}

export async function updateNoteTrackerDetailsData(data) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios.post(`${baseUrl}/lykkebo/v1/timerec/update`, data, axiosConfig)
    .then(res => res.data)
    .catch((error) => {
      console.log('error', 'updateNoteTrackerDetailsData')
    });
}

export async function modelDeleteTrackerData(data) {
  const user_id = await AsyncStorage.getItem('user_id');
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log('delete data', data)

  axios.post(`${baseUrl}/lykkebo/v1/timerec/delete`, data, axiosConfig)
    .then(res => res.data)
    .catch((error) => {
      console.log('error', 'modelDeleteTrackerData')
    });
}

export async function modelUpdateTrackerByID(data) {
  const token = await AsyncStorage.getItem('token');
  const baseUrl = await AsyncStorage.getItem('baseUrl');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log('data', data)

  axios.post(`${baseUrl}/lykkebo/v1/timerec/update`, data, axiosConfig)
    .then(res => res.data)
    .catch((error) => {
      console.log('error', error)
      console.log('error', 'modelUpdateTrackerByID')
    });
}
