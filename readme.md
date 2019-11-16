# `vhtml-loader`

Webpack loader that uses [`vhtml`](https://github.com/developit/vhtml) to render JSX into HTML without a VDOM.

Do you like [`html-webpack-plugin`](https://webpack.js.org/plugins/html-webpack-plugin/) but hate using EJS? This loader is for you. Now you can write your templates in the same way you write the rest of your React app: JSX.

1. Install: `yarn add --dev vhtml-loader`
2. Install peer deps. If you're using a standard-ish React setup you probably already have them, but if not:

   ```
   yarn add --dev \
     @babel-core \
     @babel/plugin-transform-modules-commonjs \
     @babel/plugin-transform-react-jsx \
     webpack
   ```

3. If you want to use it with `html-webpack-plugin`, install that too. (You can use `vhtml-loader` without it!)

4. Add a rule in your webpack configuration for `vhtml-loader`, marking `.html.jsx` files (or any other extension you'd like) as transformable:

   ```js
   module: {
     rules: [
       // other rules,
       {
         test: /\.html\.jsx$/,
         use: {
           loader: 'vhtml-loader',
           options: {
             @TODO
           }
         },
       },
     ],
   },
   ```

5. If you're using this loader with `html-webpack-plugin` to provide a template, configure that plugin:

   ```js
   plugins: [
     // other plugins,
     new HtmlWebpackPlugin({
       template: './src/templates/index.html.jsx',
     }),
   ];
   ```

6. Instead of steps 4 and 5, if you're _only_ planning on using this loader to transform _one_ file for an `html-webpack-plugin` template, do this:

   ```js
   plugins: [
     // other plugins,
     new HtmlWebpackPlugin({
       template: '!!vhtml-loader!./src/templates/index.html.jsx',
     }),
   ];
   ```
