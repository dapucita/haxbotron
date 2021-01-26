module.exports = {
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
            { test: /\.tsx?$/, loader: "ts-loader" },
        ],
    },
}