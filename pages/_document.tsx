import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          margin: 0,
          padding: 0,
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
