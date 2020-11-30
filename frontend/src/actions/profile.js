import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

// GEt current user profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:4000/api/profile/me");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// create profile

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: { "Content-Type": "Application/json" },
    };
    // const body = JSON.stringify(formData);
    const res = await axios.post(
      "http://localhost:4000/api/profile",
      formData,
      config
    );
    dispatch({ type: GET_PROFILE, payload: res.data });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile created", "success"));
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "Application/json" },
    };
    // const body = JSON.stringify(formData);
    const res = await axios.put(
      "http://localhost:4000/api/profile/experience",
      formData,
      config
    );
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("EXPERIENCE ADDED", "success"));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Add education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "Application/json" },
    };
    // const body = JSON.stringify(formData);
    const res = await axios.put(
      "http://localhost:4000/api/profile/education",
      formData,
      config
    );
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("EDUCATION ADDED", "success"));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};
