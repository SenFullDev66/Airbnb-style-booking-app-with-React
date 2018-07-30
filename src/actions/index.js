import axios from "axios";
import authService from "services/auth-service";
import {
  FETCH_RENTAL_BY_ID_SUCCESS,
  FETCH_RENTAL_BY_ID_INIT,
  FETCH_RENTALS_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOG_OUT
} from "./types";

// RENTALS ACTIONS -------------------------------

const fetchRentalByIdInit = () => ({
  type: FETCH_RENTAL_BY_ID_INIT
});

const fetchRentalByIdSuccess = rental => ({
  type: FETCH_RENTAL_BY_ID_SUCCESS,
  rental
});

const fetchRentalsSuccess = rentals => ({
  type: FETCH_RENTALS_SUCCESS,
  rentals
});

export const fetchRentals = () => dispatch => {
  axios
    .get("http://localhost:3001/api/v1/rentals")
    .then(res => res.data)
    .then(rentals => dispatch(fetchRentalsSuccess(rentals)));
};

export const fetchRentalById = id => dispatch => {
  dispatch(fetchRentalByIdInit());

  axios
    .get(`http://localhost:3001/api/v1/rentals/${id}`)
    .then(res => res.data)
    .then(rental => dispatch(fetchRentalByIdSuccess(rental)));
};

// AUTH ACTIONS -------------------------------

export const register = userData => {
  return axios
    .post("http://localhost:3001/api/v1/users/register", { ...userData })
    .then(res => res.data, error => Promise.reject(error.response.data.errors));
};

const loginSuccess = token => {
  return {
    type: LOGIN_SUCCESS
  };
};

const loginFailure = errors => {
  return {
    type: LOGIN_FAILURE,
    errors
  };
};

export const checkAuthState = () => dispatch => {
  if (authService.isAuthenticated()) {
    dispatch(loginSuccess);
  }
};

export const login = userData => dispatch => {
  return axios
    .post("http://localhost:3001/api/v1/users/auth", userData)
    .then(res => res.data)
    .then(token => {
      authService.saveToken(token);
      dispatch(loginSuccess());
    })
    .catch(({ response: { errors } }) => {
      dispatch(loginFailure(errors));
    });
};

export const logout = () => {
  authService.invalidateUser();
  return {
    type: LOG_OUT
  };
};
