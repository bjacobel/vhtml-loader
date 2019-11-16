const planets = ['mars', 'mercury', 'neptune', 'saturn'];

module.exports = (
  <html>
    <head>
      <title>looping fixture</title>
    </head>
    <body>
      <p>some of my favorite planets are:</p>
      <ul>
        {planets.map((planet, i) => (
          <li key={i}>{planet}</li>
        ))}
      </ul>
    </body>
  </html>
);
