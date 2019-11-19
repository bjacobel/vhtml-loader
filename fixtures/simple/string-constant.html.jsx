const things = ['planes', 'trains', 'automobiles'];

export default (
  <html>
    <head>
      <title>unterminated string constant</title>
      <p>{things.join('\n')}</p>
    </head>
  </html>
);
