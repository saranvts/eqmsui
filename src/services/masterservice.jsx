import axios from 'axios';
import config from "../environment/config";
import { authHeader } from './auth.header';

const API_URL = config.API_URL;

export const getEquipmentListService = async () => {
  try {
    const response = await axios.get(`${API_URL}api/equipment`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    throw error;
  }
}

export const saveEquipmentData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/equipment`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving equipment data:", error);
    throw error;
  }
}

export const partialUpdateEquipment = async (id, partialData) => {
  try {
    const response = await axios.patch(`${API_URL}api/equipment/${id}`, partialData, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating equipment partially:", error);
    throw error;
  }
}

export const getEquipmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}api/equipment/${id}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    throw error;
  }
}

export const getEquipmentLogListService = async () => {
  try {
    const response = await axios.get(`${API_URL}api/equipment-usage-logs`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment log list:", error);
    throw error;
  }
}

export const saveEquipmentLogData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/equipment-usage-logs`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving equipment log data:", error);
    throw error;
  }
}

export const getEquipmentLogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}api/equipment-usage-logs/${id}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment log by ID:", error);
    throw error;
  }
}

export const partialUpdateEquipmentLog = async (id, partialData) => {
  try {
    const response = await axios.patch(`${API_URL}api/equipment-usage-logs/${id}`, partialData, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating equipment log partially:", error);
    throw error;
  }
}

export const getModelListService = async () => {
  try {
    const response = await axios.get(`${API_URL}api/models`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching model list:", error);
    throw error;
  }
}

export const getModelById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}api/models/${id}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    throw error;
  }
}

export const saveModelData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/models`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving model data:", error);
    throw error;
  }
}

export const partialUpdateModel = async (id, partialData) => {
  try {
    const response = await axios.patch(`${API_URL}api/models/${id}`, partialData, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating model partially:", error);
    throw error;
  }
}

export const getMakeListService = async () => {
  try {
    const response = await axios.get(`${API_URL}api/makes`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching make list:", error);
    throw error;
  }
}


export const getMakeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}api/makes/${id}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching make by ID:", error);
    throw error;
  }
}

export const saveMakeData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/makes`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving make data:", error);
    throw error;
  }
}

export const partialUpdateMake = async (id, partialData) => {
  try {
    const response = await axios.patch(`${API_URL}api/makes/${id}`, partialData, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating make partially:", error);
    throw error;
  }
}


