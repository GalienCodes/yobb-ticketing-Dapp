const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
 mode: "development",
 entry: {
   main: path.resolve(process.cwd(), "main.js"),
 },
 plugins: [
   new webpack.ProgressPlugin(),
   new HtmlWebpackPlugin({
     template: path.resolve(process.cwd(), "index.html")
   })
 ]
}