import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/chat';

export const fetchChatMessages = async (user1Id, user2Id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${user1Id}/${user2Id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};
