export default (
  <html>
    <body>
      <p>vhtml "will" escape 'bad stuff' & that is good & correct</p>
      <p
        dangerouslySetInnerHTML={{
          __html: `this content "will" 'not' be escaped & that's ok`,
        }}
      />
    </body>
  </html>
);
