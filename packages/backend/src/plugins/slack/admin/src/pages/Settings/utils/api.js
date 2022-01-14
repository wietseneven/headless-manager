import axiosInstance from '../../../utils/axiosInstance';

const fetchSlackSettings = async () => {
  const { data } = await axiosInstance.get('/slack/settings');

  return data.config;
};

const fetchSlackChannels = async () => {
  const { data } = await axiosInstance.get('/slack/channels');

  return data.channels;
};

const postMessageTest = async body => {
  try {
    return await axiosInstance.post('/slack/test', body);
  } catch(e) {
    throw new Error(e.response?.data?.error?.message);
  }
};

export { fetchSlackSettings, fetchSlackChannels, postMessageTest };
