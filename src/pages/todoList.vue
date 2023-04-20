<template>
    <div class="todo-list">
        <div class="wrapper">
            <h1 class="head-md">Todo list</h1>
            <hr>
            <div class="todo-list-body" :class="{'is-loading': isLoading}">
                <div class="todo-list-body-user">
                    <h5 class="head-sm">User info</h5>
                    <p v-for="(value, key) in userInfo" :key="key" class="user-info">{{ key }}: {{ value }}</p>
                </div>
                <div class="todo-list-body-list">
                    <h5 class="head-sm">Todos</h5>
                    <Todo ref="todo"/>
                </div>
                <form class="todo-list-body-add">
                    <h5 class="head-sm">Add new todo</h5>
                    <div class="form-group" :class="{'is-invalid': validation.userId !== null}">
                        <input
                            type="number"
                            class="form-control"
                            placeholder="User ID"
                            v-model.number="todo.userId">
                        <div class="invalid-tooltip" v-if="validation.userId !== null">
                            {{ validation.userId }}
                        </div>
                    </div>

                    <div class="form-group" :class="{'is-invalid': validation.title !== null}">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Title"
                            v-model="todo.title">
                        <div class="invalid-tooltip" v-if="validation.title !== null">
                            {{ validation.title }}
                        </div>
                    </div>

                    <button
                        class="btn btn-info"
                        type="submit"
                        @click.prevent="addTodo">
                        Add
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Todo from '../components/Todo.vue';
export default {
    name: 'todo-list',
    data() {
        return {
            userInfo: null,
            favorites: [],
            todo: {
                userId: '',
                title: ''
            },
            validation: {
                userId: null,
                title: null,
            },
            idIncrement: 0,
            isLoading: true,
        }
    },
    async mounted() {
        if (!this.$route.query.id) {
            await this.$router.push('/');
        }

        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${this.$route.query.id}`);
        this.userInfo = await userResponse.json();

        this.userInfo.address = this.userInfo?.address?.city;
        this.userInfo.company = this.userInfo?.company?.name;

        this.isLoading = false;
    },

    methods: {
        addTodo() {
            this.clearValidation();
            this.validate();

            if (this.validation.userId !== null || this.validation.title !== null) {
                return;
            }

            fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    id: 501,
                    userId: this.todo.userId,
                    title: this.todo.title
                }),
            })
                .then(response => response.json())
                .then(data => {
                    data.id += this.idIncrement;
                    data.completed = false;
                    this.idIncrement += 1;

                    this.$refs.todo.addTodo(data);

                    this.todo.userId = '';
                    this.todo.title = '';
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },

        validate() {
            if (!this.todo.userId) {
                this.validation.userId = 'Type something';
            } else {
                if (!(/^[0-9]+$/.test(this.todo.userId))) {
                    this.validation.userId = 'Allowed only numbers';
                }
            }

            if (!this.todo.title.trim()) {
                this.validation.title = 'Type something';
            }
        },

        clearValidation() {
            this.validation.userId = null;
            this.validation.title = null;
        }
    },

    components: {
        Todo,
    }
}
</script>
