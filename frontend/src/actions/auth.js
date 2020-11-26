import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
} from "./types";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("http://localhost:4000/api/users");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// resgiter user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post(
      "http://localhost:4000/api/users/register",
      body,
      config
    );
    console.log(res.data);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};
