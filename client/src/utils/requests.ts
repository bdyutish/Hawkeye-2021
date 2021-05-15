import axios from "axios";

const fetcher = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const get = async (url: string) => {
  try {
    const raw = await fetcher.get(url);
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const post = async (
  url: string,
  data?: object,
  params?: object,
  formData = false
) => {
  try {
    const raw = await fetcher.post(url, data, {
      params,
      headers: {
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const put = async (url: string, data?: object, params?: object) => {
  try {
    const raw = await fetcher.put(url, data, { params });
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCall = async (url: string) => {
  try {
    const raw = await fetcher.delete(url);
    return raw.data;
  } catch (err) {
    throw err;
  }
};
