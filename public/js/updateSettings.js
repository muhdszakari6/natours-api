import axios from 'axios';
import { showAlert } from './alert';
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', ` ${type.toUpperCase()} Updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
