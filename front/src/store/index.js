import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import localForage from 'localforage'


// import modules
import users from './modules/users'
import login from './modules/login'
import services from './modules/services'
import orders from './modules/orders'
import calls from './modules/calls/calls'
import notifications from './modules/notifications'
import profile from './modules/profile'

Vue.use(Vuex)

const vuexStorage = new VuexPersist({
    key: 'helpDesk',
    storage: localForage,
    asyncStorage: true,
    saveState: (key, state, storage) => Promise.resolve(storage.setItem(key, state)),
    modules: ['login']
})

export default new Vuex.Store({
    plugins: [vuexStorage.plugin],
    state: {
        btnSideBar: null,
        loading: false,
    },
    mutations: {

        activeSideBar(state) {
            state.btnSideBar = !state.btnSideBar
        },
        updateBtnSideBar(state, value) {
            state.btnSideBar = value
        },
        setLoading(state, payload) {
            state.loading = payload
        }
    },

    getters: {
        getBtnSideBar(state) {
            return state.btnSideBar
        },
    },
    modules: {
        users,
        login,
        services,
        orders,
        calls,
        notifications,
        profile,
    }
})