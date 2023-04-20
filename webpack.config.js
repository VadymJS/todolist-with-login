const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',

    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },

    devServer: {
        static: {
            directory: path.join(__dirname, '/')
        },
        port: 8877,
        hot: true,
        open: true,
    },

    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
    ]
};
