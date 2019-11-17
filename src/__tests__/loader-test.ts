import compiler from '../utils/memFsCompiler';

const parseOutput = (output: string): string =>
  (output.match(/module\.exports = '(.*)';/) ?? ['no module.export found'])[1];

describe('vhtml-loader', () => {
  it('handles a file with no jsx', async () => {
    const output = await compiler('no-jsx.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });

  it('handles a file with jsx interpolation', async () => {
    const output = await compiler('interpolation.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });

  it('handles a file with jsx loops', async () => {
    const output = await compiler('loops.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });

  it('handles a file with jsx functions', async () => {
    const output = await compiler('function.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });

  it('handles a file with a props object spread', async () => {
    const output = await compiler('spread.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });

  it('handles a file with a commonjs export', async () => {
    const output = await compiler('commonjs.html.jsx');
    expect(parseOutput(output)).toMatchSnapshot();
  });
});
