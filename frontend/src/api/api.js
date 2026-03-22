import axios from 'axios';

const API = axios.create({
  baseURL: 'http://172.20.10.4:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ──────────────────────────────────────────────
export const login = (username, password) =>
  API.post('/auth/login', { username, password });

export const register = (data) =>
  API.post('/auth/register', data);

// ── Vehicles ──────────────────────────────────────────
export const getVehicles = () =>
  API.get('/vehicles/');

export const addVehicle = (data) =>
  API.post('/vehicles/', data);

export const getVehicleByPlate = (plate) =>
  API.get(`/vehicles/${encodeURIComponent(plate)}`);

// ── Gate ───────────────────────────────────────────────
export const scanVehicle = (formData) =>
  API.post('/gate/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const recordEntry = (data) =>
  API.post('/gate/entry', data);

export const recordExit = (data) =>
  API.post('/gate/exit', data);

export const getEntryLogs = (params = {}) =>
  API.get('/gate/logs', { params });

// ── Parking ───────────────────────────────────────────
export const getParkingZones = () =>
  API.get('/parking/zones');

// ── Stats ─────────────────────────────────────────────
export const getStats = (role) =>
  API.get('/stats', { params: { role } });

// ── ANPR ──────────────────────────────────────────────
export const detectPlate = async (file) => {

  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post("http://172.20.10.4:5000/api/anpr",
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

  return response.data.plate;
};

export default API;
