import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getAllIncidents = () => axios.get(`${BASE_URL}/api/incidents`);

export const getIncidentById = (id) => axios.get(`${BASE_URL}/api/incidents/${id}`);

export const createIncident = (incident) => axios.post(`${BASE_URL}/api/incidents`, incident);

export const updateIncident = (id, incidentData) =>
  axios.put(`${BASE_URL}/api/incidents/${id}`, incidentData);

export const deleteIncident = (id) => axios.delete(`${BASE_URL}/api/incidents/${id}`);

export const registerUser = (username, password) =>
  axios.post(`${BASE_URL}/api/auth/register`, { username, password });

export const loginUser = (username, password) =>
  axios.post(`${BASE_URL}/api/auth/login`, { username, password });