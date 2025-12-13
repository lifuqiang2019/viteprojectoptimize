import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue')
        },
        {
            path: '/table',
            name: 'table',
            component: () => import('../views/Table.vue')
        },
        {
            path: '/three',
            name: 'three',
            component: () => import('../views/Three.vue')
        },
        {
            path: '/pdf',
            name: 'pdf',
            component: () => import('../views/Pdf.vue')
        },
        {
            path: '/editor',
            name: 'editor',
            component: () => import('../views/Editor.vue')
        }
    ]
})

export default router
