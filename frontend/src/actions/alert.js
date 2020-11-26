// import uuid from "uuid/v4";
import { v4 as uuid } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./types";
// const { SET_ALERT } = require("./types");
// import uuid from "uuid/v4";
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
