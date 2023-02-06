import {
  SET_SHOW_LOADING,
  SET_TRACKER_BOOKING,
  SET_TRACKER_DAILYNOTE,
} from '../actions/types';

const initialState = {
  isLoading: true,
  trackerBookings: [],
  trackerDailyNotes: [],
};

export default function (state = initialState, action) {
  // console.log('action', action)
  switch (action.type) {
  case SET_SHOW_LOADING:
    return { ...state, isLoading: action.payload};

  case SET_TRACKER_BOOKING:
    return { ...state, trackerBookings: action.payload};

  case SET_TRACKER_DAILYNOTE:
    return { ...state, trackerDailyNotes: action.payload};

  // case SET_SHOW_LOADING_TOGGLE:
  //   return { ...state, isLoadingToggle: action.payload};

  default:
    return state;
  }
}
