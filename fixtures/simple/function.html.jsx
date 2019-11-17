// I made the orders up don't judge me for not knowing
const planets = [
  { name: 'mars', order: 4, attributes: ['dusty', 'red'] },
  { name: 'mercury', order: 1, attributes: ['rocky', 'hot', 'tiny'] },
  { name: 'neptune', order: 7, attributes: ['big', 'blue', 'gassy'] },
  { name: 'saturn', order: 9, attributes: ['ringed'] },
];

const formatPlanet = ({ name, order, attributes }, i) => (
  <div key={i}>
    <h2>{name}</h2>
    <p>it's planet #{order} from the sun</p>
    <p>according to my research it is</p>
    <ul>
      {attributes.map((a) => (
        <li>{a}</li>
      ))}
    </ul>
  </div>
);

export default (
  <html>
    <head>
      <title>looping fixture</title>
    </head>
    <body>
      <p>some of my favorite planets are:</p>
      <ul>{planets.map(formatPlanet)}</ul>
    </body>
  </html>
);
