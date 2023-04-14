import {
  SET_SHOW_LOADING,
  SET_JOB_DETAILS,
  SET_SHOW_LOADING_TOGGLE,
} from "./types";

import {
  modelFetchJobDetails,
  modelUpdateWorkingDays,
} from "../models/jobDetails";

export const setShowLoading = (isShow) => ({
  type: SET_SHOW_LOADING,
  payload: isShow,
});

export const setShowLoadingToggle = (isShow) => ({
  type: SET_SHOW_LOADING_TOGGLE,
  payload: isShow,
});

export const setJobDetails = (payload) => ({
  type: SET_JOB_DETAILS,
  payload,
});
export const getJobDetails = (userId, jobId) => async (dispatch) => {
  dispatch(setShowLoading(true));
  const data = await modelFetchJobDetails(userId, jobId);
  dispatch(setJobDetails(data));
  dispatch(setShowLoading(false));
  return data;
};

export const getJobDetailsNoLoading = (userId, jobId) => async (dispatch) => {
  const data = await modelFetchJobDetails(userId, jobId);
  dispatch(setJobDetails(data));
};

export const updateWorkingDay = (data) => async (dispatch) => {
  dispatch(setShowLoadingToggle(true));
  await modelUpdateWorkingDays(data);
  const result = await modelFetchJobDetails(data.user_id, data.job_id);
  dispatch(setJobDetails(result));
  dispatch(setShowLoadingToggle(false));
};
