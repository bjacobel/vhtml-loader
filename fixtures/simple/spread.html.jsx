const props = {
  className: 'big',
  'aria-live': 'false',
};

export default (
  <html>
    <head>
      <title>props spread fixture</title>
    </head>
    <body>
      <div {...props}></div>
    </body>
  </html>
);
