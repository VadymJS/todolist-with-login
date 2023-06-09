<template>
    <div class="todo-list-body-list-background">
        <div class="list-filter">
            <div class="form-row">
                <input
                    type="text"
                    class="form-control"
                    placeholder="User ID"
                    @input="filterTodos"
                    v-model="filter.title">
                <select
                    class="form-control"
                    @change="filterTodos"
                    v-model="filter.todo">
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="uncompleted">Uncompleted</option>
                    <option value="favourites">Favorites</option>
                </select>
                <select
                    class="form-control"
                    @change="filterTodos"
                    v-model="filter.userId">
                    <option value="all">All users</option>
                    <option
                        v-for="(todo, index) in todos"
                        :key="index"
                        :value="todo.userId"
                        v-if="todos.findIndex(t => t.userId === todo.userId) === index">
                        {{ todo.userId }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="!todos.length" class="list-nodata head-md">
            No todos
        </div>
        <div v-else class="list-group">
            <div v-for="todo in todos" :key="todo.id"  class="list">
                <div class="list-body">
                    <div class="list-body-title">
                        <span class="list-body-title-id">Id: {{ todo.id }}</span>
                        <span>User id: {{ todo.userId }}</span>
                    </div>
                    <p>{{ todo.title }}</p>
                </div>
                <div class="list-actions">
                    <button class="btn btn-bordered btn-icon" @click="addToFavourite(todo.id)">
                        <svg
                            class="svg-icon"
                            :class="{'fill-error': todo.isFavourite}"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                        </svg>
                    </button>
                    <div class="custom-control">
                        <input
                            type="checkbox"
                            :id="'todo-checkbox-' + todo.id"
                            class="form-checkbox"
                            @click="toggleTodo(todo.id)"
                            :checked="todo.completed">
                        <label
                            :for="'todo-checkbox-' + todo.id"
                            class="form-label">
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filter: {
                title: null,
                todo: 'all',
                userId: 'all',
            },
            todos: [],
            todosBackup: null,
            favorites: [],
        }
    },

    async mounted() {
        const todosResponse = await fetch('https://jsonplaceholder.typicode.com/todos');
        this.todos = await todosResponse.json();

        this.favorites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (this.favorites.length) {
            this.todos.forEach((element) => {
                element.isFavourite =  this.favorites.includes(element.id);
            });
        }

        this.todosBackup = this.todos;
    },

    methods: {
        toggleTodo(id) {
            let todoCurrent = this.todos.find((todo) => {
                return todo.id === id;
            });

            todoCurrent.completed = !todoCurrent.completed;

            this.filterTodos();
        },

        addToFavourite(id) {
            let todoFavourite = this.todos.find((todo) => {
                return todo.id === id;
            });

            if (todoFavourite) {
                todoFavourite.isFavourite = !todoFavourite.isFavourite;

                if (todoFavourite.isFavourite) {
                    this.favorites.push(todoFavourite.id);

                    localStorage.setItem('favourites', JSON.stringify(this.favorites));
                } else {
                    const indexToDelete = this.favorites.indexOf(todoFavourite.id);

                    if (indexToDelete !== -1) {
                        this.favorites.splice(indexToDelete, 1);
                    }

                    localStorage.setItem('favourites', JSON.stringify(this.favorites));
                }
            }

            this.filterTodos();
        },

        filterTodos() {
            this.todos = this.todosBackup;

            this.todos = this.todos.filter((todo) => {
                return (
                    (!this.filter.title || todo.title.includes(this.filter.title)) &&

                    (this.filter.todo === 'all' ||
                        (this.filter.todo === 'completed' && todo.completed === true) ||
                        (this.filter.todo === 'uncompleted' && todo.completed === false) ||
                        (this.filter.todo === 'favourites' && todo.isFavourite === true)) &&

                    (this.filter.userId === 'all' || todo.userId === this.filter.userId)
                );
            });
        },

        addTodo(todo) {
            this.todosBackup.unshift(todo);

            this.filterTodos();
        }
    }
}
</script>
