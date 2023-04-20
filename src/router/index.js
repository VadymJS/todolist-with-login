import Vue from 'vue'
import Login from '../pages/login.vue';
import TodoList from '../pages/todoList.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/todo-list',
      component: TodoList
    }
  ]
})

export default router
