<template>
    <div class="login">
        <form class="card">
            <div class="card-title">
                <h2>Login</h2>
            </div>
            <div class="card-body">
                <p>Enter your username & password</p>
                <div class="form-group" :class="{'is-invalid': validation.username !== null}">
                    <input
                        class="form-control"
                        type="text"
                        placeholder="Username"
                        v-model="form.username">
                    <div class="invalid-tooltip" v-if="validation.username !== null">
                        {{ validation.username }}
                    </div>
                </div>

                <div class="form-group" :class="{'is-invalid': validation.phone !== null}">
                    <input
                        class="form-control"
                        type="tel"
                        placeholder="Phone Number"
                        v-model="form.phone">
                    <div class="invalid-tooltip" v-if="validation.phone !== null">
                        {{ validation.phone }}
                    </div>
                </div>

                <button
                    class="btn btn-success"
                    type="submit"
                    @click.prevent="emitLogin">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script>

export default {
    name: 'login',
    data() {
        return {
            form: {
                username: '',
                phone: '',
            },
            validation: {
                username: null,
                phone: null,
            }
        }
    },
    methods: {
        async emitLogin() {
            this.clearValidation();
            this.validate();

            if (this.validation.username !== null || this.validation.phone !== null) {
                return;
            }

            let isLogin = false;
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await response.json();

            let existedUser = users.find(user =>
                user.username === this.form.username &&
                user.phone.replace(/\sx\d+/gi, "") === this.form.phone
            );

            if (existedUser) {
                isLogin = true;
            }

            if (isLogin) {
                await this.$router.push({
                    path: '/todo-list',
                    query: { id: existedUser.id }
                });
            } else {
                this.validation.username = 'Login error: Incorrect username';
                this.validation.phone = 'Login error: Or phone';
            }
        },

        validate() {
            if (!this.form.username.trim()) {
                this.validation.username = 'Type something';
            } else {
                if (!(/^[a-zA-Z]+$/.test(this.form.username))) {
                    this.validation.username = 'Allowed only letters';
                }
            }

            if (!this.form.phone.trim()) {
                this.validation.phone = 'Type something';
            } else {
                if (!(/^[0-9!@#\$%\^\&*\)\(+=._-]+$/.test(this.form.phone))) {
                    this.validation.phone = 'Allowed only numbers or symbols';
                }
            }
        },

        clearValidation() {
            this.validation.username = null;
            this.validation.phone = null;
        }
    }
}
</script>
