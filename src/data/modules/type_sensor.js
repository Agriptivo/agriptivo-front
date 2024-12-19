import axiosInstance from "../../api/axiosInstances";

const state = {
  sensores: null,
};
const mutations = {
  LIST(state, sensor) {
    state.sensores = sensor;
  },
};
const actions = {
  async register({ commit }, credentials) {
    try {
      const response = await axiosInstance.post("api/tsensor", credentials);
      const { data } = response;

      if (data.status === "success" && data.message) {
        return data.message;
      } else {
        const error = new Error(data.message);
        error.data = data;
        throw error;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async update({ commit }, { credentials, id }) {
    try {
      console.log(credentials);
      const response = await axiosInstance.patch(
        `api/tsensor/${id}`,
        credentials
      );
      const { data } = response;

      if (data.status === "success" && data.message) {
        return data.message;
      } else {
        const error = new Error(data.message);
        error.data = data;
        throw error;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async list({ commit }, id) {
    try {
      const response = await axiosInstance.get(`/api/tsensores`);
      const { results } = response.data;
      commit("LIST", results);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async delete({}, id) {
    try {
      const response = await axiosInstance.delete(`api/tsensor/${id}`);
      const { data } = response;

      if (data.status === "success" && data.message) {
        return data.message;
      } else {
        const error = new Error(data.message);
        error.data = data;
        throw error;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
const getters = {
  sensores: (state) => state.sensores,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
