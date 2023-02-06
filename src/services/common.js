import Promise from 'bluebird';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

export function fetchTryHttp(url, fetchOptions = {}) {
  let tryingHttps = false;
  return new Promise((resolve, reject) => {
    function success(response) {
      // console.log('response::::::', response);
      // console.warn('status::::::', response.status);
      resolve(response);
    }
    function failureOnHttp(error) {
      if (!tryingHttps) {
        tryingHttps = true;
        fetchUrl('https');
      } else {
        reject(error);
      }
    }
    function finalHandler(finalError) {
      reject(finalError);
    }
    function fetchUrl(mode) {
      return fetch(`${mode}://${url}`, fetchOptions)
        .then(success)
        .catch(failureOnHttp)
        .catch(finalHandler);
    }
    fetchUrl('http');
  });
}

export function toTimestamp(strDate) {
  const datum = Date.parse(strDate);
  return datum / 1000;
}

export function toTimestampWithSeconds(strDate) {
  const dateString = `${strDate} 23:59:59`;
  const dateTimeParts = dateString.split(' ');
  // const timeParts = dateTimeParts[1].split(':');
  const dateParts = dateTimeParts[0].split('-');

  return Date.parse(new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, 1, 23, 59, 59)) / 1000;
}

export function setBookingStatus(step) {
  let bookingStatus = 0;
  switch (step) {
  case 0:
    bookingStatus = 1; // not started
    break;
  case 1:
    bookingStatus = 5; // customer contacted
    break;
  case 2:
    bookingStatus = 4; // on-ngoing
    break;
  case 3:
    bookingStatus = 2; // done
    break;
  default:
    return bookingStatus;
  }
  return bookingStatus;
}

export function getBookingStatus(status) {
  let step = 1;
  switch (status) {
  case 1:
    step = 0; // not started
    break;
  case 5:
    step = 1; // customer contacted
    break;
  case 4:
    step = 2; // on-ngoing
    break;
  case 2:
    step = 3; // done
    break;
  default:
    return step;
  }
  return step;
}

export function setDayStatus(status) {
  let dayStatus = 2;
  switch (status) {
  case 'Ferie':
    dayStatus = 2;
    break;
  case 'Sygdom':
    dayStatus = 3;
    break;
  case 'Skole':
    dayStatus = 4;
    break;
  case 'Andet':
    dayStatus = 5;
    break;
  default:
    return dayStatus;
  }
  return dayStatus;
}

export function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertSecondsToTime(sec) {
  const date = new Date(null);
  date.setSeconds(sec); // specify value for SECONDS here
  return date.toISOString().substr(11, 8);
}

export function convertSecondsToTimeNoSeconds(sec) {
  const date = new Date(null);
  date.setSeconds(sec); // specify value for SECONDS here
  return date.toISOString().substr(11, 5);
}

async function getStoreData(key) {
  const val = await AsyncStorage.getItem(`@DeskmaAppV2:${key}`);

  if (val !== null && typeof val !== 'object') {
    return val;
  }
  return '';
}

async function getUsername() {
  const username = await getStoreData('username');

  return username;
}

async function getEncoded(username) {
  const encoded = await getStoreData('encoded');

  return {
    username,
    encoded,
  };
}

async function getUrl(obj) {
  const url = await getStoreData('url');

  const newObj = obj;
  newObj.url = url;

  return newObj;
}

export function getAuthData() {
  return new Promise((resolve, reject) => {
    getUsername()
      .then(username => getEncoded(username))
      .then(obj => getUrl(obj))
      .then((obj) => {
        resolve(obj);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getListDateInTimeStamp(date, minusOneDay, counter = 30) {
  let i;
  const dates = [];
  let newDate = null;
  const dateArray = date.split('-');
  for (i = 0; i < counter; i++) {
    const d = new Date();
    if (minusOneDay) {
      newDate = d.setDate(d.getDate() - i);
      // have to remove last 3 digit for proper timestamp format
    } else {
      newDate = d.setDate(d.getDate());
    }
    // dates[i] = (newDate - (newDate % 1000)) / 1000;
    dates[i] = newDate;
  }
  return dates.reverse();
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function getTimeInterval(startTime, endTime, lunchTime){
  // console.log('startTime', startTime)
  // console.log('endTime', endTime)
  // console.log('lunchTime', lunchTime)
  var start = moment(startTime, "HH:mm");
  // console.log('start', start)
  var end = moment(endTime, "HH:mm");
  var minutes = end.diff(start, 'minutes');
  var interval = moment().hour(0).minute(minutes);
  interval.subtract(lunchTime, 'seconds');

  return interval.format("HH:mm");
}


export function convertTimeToSeconds(time) {
  const h = time.split(':');
  // return Number(h[0]) * 3600 + Number(h[1]) * 60 + Number(h[2]);

  return Number(h[0]) * 3600 + Number(h[1]) * 60;
};
