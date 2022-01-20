import { createRouter, createWebHistory } from "vue-router";
import Welcome from "../views/Welcome.vue";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

import Profile from "../views/Profile.vue"
import ProfileEdit from "../views/ProfileEdit.vue"

import Post from "../views/Post.vue"
import PostCreate from "../views/PostCreate.vue"
import PostEdit from "../views/PostEdit.vue"


const routes = [
    {
        path: "/",
        component: Welcome
    },
    {
        path: "/home",
        component: Home
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/register",
        component: Register
    },
    {
        path: "/profile",
        component: Profile,
        props: true
    },
    {
        path: "/profile/edit",
        component: ProfileEdit,
        props: true
    },
    {
        path: "/post",
        component: Post,
        props: true
    },
    {
        path: "/post/create",
        component: PostCreate,
        props: true
    },
    {
        path: "/post/edit",
        component: PostEdit,
        props: true
    }
];

export default createRouter({history:createWebHistory(process.env.BASE_URL), routes});