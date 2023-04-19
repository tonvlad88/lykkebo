import {
  SET_SHOW_LOADING,
  SET_TRACKER_BOOKING,
  SET_TRACKER_DAILYNOTE,
} from "./types";

import {
  modelFetchTracker,
  modelsaveDailyNote,
  deleteNoteTrackerDetailsData,
  updateNoteTrackerDetailsData,
  modelDeleteTrackerData,
  modelUpdateTrackerByID,
} from "../models/tracker";

export const setShowLoading = (isShow) => ({
  type: SET_SHOW_LOADING,
  payload: isShow,
});

export const setTracker = (payload) => ({
  type: SET_TRACKER_BOOKING,
  payload,
});

export const setDailyNote = (payload) => ({
  type: SET_TRACKER_DAILYNOTE,
  payload,
});

export const getTracker = (userId, date) => async (dispatch) => {
  dispatch(setShowLoading(true));
  const data = await modelFetchTracker(userId, date);
  dispatch(setTracker(data.data));
  dispatch(setDailyNote(data.internal_recordings));
  dispatch(setShowLoading(false));
  return data;
};

export const saveDailyNote = (data, date) => async (dispatch) => {
  await modelsaveDailyNote(data);
  const res = await modelFetchTracker(data.user_id, date);
  dispatch(setTracker(res.data));
  dispatch(setDailyNote(res.internal_recordings));
};

export const deleteNoteTrackerData = (deleteTrackerData) => async () => {
  const trackerDataResult = await deleteNoteTrackerDetailsData(
    deleteTrackerData
  );
  return trackerDataResult;
};

export const updateDailyNote = (updateTrackerData) => async () => {
  const trackerDataResult = await updateNoteTrackerDetailsData(
    updateTrackerData
  );
  return trackerDataResult;
};

export const deleteTrackerData = (data) => async () => {
  const res = await modelDeleteTrackerData(data);
  return res;
};

export const updateTrackerByID = (params) => async () => {
  const res = await modelUpdateTrackerByID(params);
  return res;
};
