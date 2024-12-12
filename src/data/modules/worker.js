import axiosInstance from "../../api/axiosInstances";

const state = {
  activity_worker: null,
};
const mutations = {
  LIST(state, activity_worker) {
    state.activity_worker = activity_worker;
  },
};
const actions = {
  async list({ commit }) {
    try {
      const response = await axiosInstance.get(`/api/allactivitiesworker`);
      const { results } = response.data;
      commit("LIST", results);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
const getters = {
  activity_worker: (state) => state.activity_worker,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
