import api from "@/apis/index";

export const sendPostRequest = async (endpoint, payload) => {
  try {
    const response = await api.post(endpoint, payload);
    // Return actual data on success
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || error.message || "Something went wrong";
    return errorMsg;
  }
};

export const sendGetRequest = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch data from the server.";
    throw new Error(errorMsg);
  }
};
