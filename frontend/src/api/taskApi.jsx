// import axios from 'axios';

// // For local testing
// // const API_URL = 'http://localhost:5000/tasks';

// // For deployed Render backend
// const API_URL = 'https://todoapp-slmn.onrender.com/tasks';

// export const getTasks = () => axios.get(API_URL);
// export const addTask = (task) => axios.post(API_URL, task);
// export const updateTask = (id, data) => axios.patch(`${API_URL}/${id}`, data);
// export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
import axios from 'axios';

const API_URL = 'https://personalremainder.onrender.com/tasks';

export const getTasks = () => axios.get(API_URL);
export const addTask = (task) => axios.post(API_URL, task);
export const updateTask = (id, data) => axios.patch(`${API_URL}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
