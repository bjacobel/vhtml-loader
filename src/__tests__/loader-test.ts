import compiler from '../utils/memFsCompiler';

describe('vhtml-loader', () => {
  it('handles a file with no jsx', async () => {
    const output = await compiler('no-jsx.html.jsx');

    expect(output).toMatchSnapshot();
  });

  it('handles a file with jsx interpolation', async () => {
    const output = await compiler('interpolation.html.jsx');

    expect(output).toMatchSnapshot();
  });

  it('handles a file with jsx loops', async () => {
    const output = await compiler('loops.html.jsx');

    expect(output).toMatchSnapshot();
  });
});
