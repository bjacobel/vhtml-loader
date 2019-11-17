const scriptBlock = (scripts = [], type) => (
  <script {...type}>
    {scripts.map(
      (script, i) => `
        var script${i} = document.createElement('script');
        script${i}.type = 'text/javascript';
        script${i}.src = '${script}';
        document.body.appendChild(script${i});
      `,
    )}
  </script>
);

export default (
  <html>
    <body>
      <p>vhtml "will" escape stuff 'inside' elements like p tags & headers</p>
      {scriptBlock(htmlWebpackPlugin.files.js, { type: 'module' })}
    </body>
  </html>
);
