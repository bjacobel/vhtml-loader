import React from 'react';

const props: Record<string, string> = {
  className: 'big',
  'aria-live': 'false',
};

export default (
  <html>
    <head>
      <title>props spread fixture with typescript</title>
    </head>
    <body>
      <div {...props}></div>
    </body>
  </html>
);
