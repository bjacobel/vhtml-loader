import compiler from '../utils/memFsCompiler';

const fixtures = (f: string) => `../../fixtures/${f}.html.jsx`;

describe('vhtml-loader', () => {
  it('renders the module source', async () => {
    const { source } = await compiler(fixtures('simple/no-jsx'));
    expect(source).toMatchSnapshot();
  });

  describe('simple jsx compilation', () => {
    it('handles a file with no jsx', async () => {
      const { html } = await compiler(fixtures('simple/no-jsx'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with jsx interpolation', async () => {
      const { html } = await compiler(fixtures('simple/interpolation'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with jsx loops', async () => {
      const { html } = await compiler(fixtures('simple/loops'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with jsx functions', async () => {
      const { html } = await compiler(fixtures('simple/function'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with a props object spread', async () => {
      const { html } = await compiler(fixtures('simple/spread'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with a commonjs export', async () => {
      const { html } = await compiler(fixtures('simple/commonjs'));
      expect(html).toMatchSnapshot();
    });

    it('handles a file with react imported in scope', async () => {
      const { html } = await compiler(fixtures('simple/react-scope'));
      expect(html).toMatchSnapshot();
    });

    it("doesn't prepend doctype if { doctype: false }", async () => {
      const { html } = await compiler(
        fixtures('simple/no-jsx'),
        {},
        { doctype: false },
      );
      expect(html).toMatchSnapshot();
    });

    it('escapes content written inside jsx functions correctly', async () => {
      const { html } = await compiler(fixtures('simple/escaping'));
      expect(html).toMatchSnapshot();
    });
  });

  describe('htmlwebpackplugin magic', () => {
    it('can access htmlWebpackPlugin.options from the template', async () => {
      const { html } = await compiler(fixtures('htmlwebpackplugin/options'), {
        title: 'test',
      });
      expect(html).toMatchSnapshot();
    });

    it('templates out files included by htmlwebpackplugin', async () => {
      const { html } = await compiler(fixtures('htmlwebpackplugin/files'));
      expect(html).toMatchSnapshot();
    });
  });
});
