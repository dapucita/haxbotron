const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    context: __dirname, // to automatically find tsconfig.json
    entry: "./react/index.tsx",
    
    output: {
        filename: "react.bundle.js",
        path: __dirname + "/public/out",
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    // disable type checker - use it in fork plugin
                    transpileOnly: true
                }
            },
        ],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()]
}
