import {
  SET_SHOW_LOADING,
  SET_JOB_DETAILS,
  SET_SHOW_LOADING_TOGGLE,
} from '../actions/types';

const initialState = {
  datas: [],
  isLoading: true,
  isLoadingToggle: false,
};

export default function (state = initialState, action) {
  // console.log('action', action)
  switch (action.type) {
  case SET_SHOW_LOADING:
    return { ...state, isLoading: action.payload};

  case SET_JOB_DETAILS:
    return { ...state, datas: action.payload};

  case SET_SHOW_LOADING_TOGGLE:
    return { ...state, isLoadingToggle: action.payload};

  default:
    return state;
  }
}
