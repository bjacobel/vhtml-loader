export default (
  <html>
    <body>
      {htmlWebpackPlugin.files.js.map((file) => (
        <script type="text/javacript" src={file} />
      ))}
    </body>
  </html>
);
