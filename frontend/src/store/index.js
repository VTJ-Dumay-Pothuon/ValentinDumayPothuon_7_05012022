import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {authentificated: false, canEditProfile: false, canEditPost: false, userId: 0},
    mutations: {
        setAuthentificated: function (state, authentificated) {
            state.authentificated = authentificated;
        },
        setProfileEdit: function (state, canEdit) {
            state.canEditProfile = canEdit;
        },
        setPostEdit: function (state, canEdit) {
            state.canEditPost = canEdit;
        },
        setUserId: function (state, userId) {
            state.userId = userId;
        }
    },
    actions: {
        setAuthentificated: function (req, authentificated) {
            req.commit('setAuthentificated', authentificated);
        },
        setProfileEdit: function (req, canEdit) {
            req.commit('setProfileEdit', canEdit);
        },
        setPostEdit: function (req, canEdit) {
            req.commit('setPostEdit', canEdit);
        },
        setUserId: function (req, userId) {
            req.commit('setUserId', userId);
        }
    },
    plugins: [ createPersistedState() ]
});
