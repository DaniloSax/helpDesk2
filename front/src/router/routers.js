import Vue from 'vue'
import VueRouter from 'vue-router'
import localForage from 'localforage'

import UsersRouters from './modules/usersRouters'
import ServicesRouters from './modules/ServicesRouters'
import CallsRouters from './modules/CallsRouters'
import ProfileRouters from './modules/ProfileRoutes'

import Home from '@/views/home/ControllerHome'
import Login from '@/views/login/Login'
import Unauthorized from '@/views/aborts/401'



Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            requireAuth: false,
            grantAll: true,
        },
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home,
        // meta: {
        //     requireAuth: true,
        //     grantAll: false,
        //     grants: ['administrador', 'direcionador']
        // },
    },
    ...UsersRouters,
    ...ServicesRouters,
    ...CallsRouters,
    ...ProfileRouters,
    { name: 'error401', path: '/unauthorized', component: Unauthorized },
    { path: '*', component: Home },
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')

    if (to.name !== 'login' && !token) {
        next('/login')
    } else {
        next()
    }
    if (from.path == '/home') {
        console.clear()
    }

    if (to.meta.requireAuth) {
        // cargar data auth localStorage
        localForage.getItem('helpDesk').then(value => {
            const roles = value.login.auth.roles.map(r => r.name)

            const rolesEgrants = to.meta.grants.filter(item => {
                if (roles.includes(item)) {
                    return item
                } else { return false }

            })
            console.log(rolesEgrants)
            if (token && rolesEgrants) {
                next()
            }
            if (token && rolesEgrants == '') {
                next({ name: 'error401' });
            }

        }).catch(error => console.log(error));

    }

});

export default router;