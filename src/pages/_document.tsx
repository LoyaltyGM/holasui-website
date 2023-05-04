import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="NFT staking platform on Sui" />

        <meta name="keywords" content="Sui, NFT, Staking, Reward platform,Token reward, Points rewards" />
        {/* icons */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" /> */}
        {/* Twitter and Social Network Information */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="¡HolaSui!" />
        <meta name="twitter:title" content="¡HolaSui!" />
        <meta name="twitter:description" content="hola, ola, ola!" />
        {/*TODO:*/}
        <meta name="twitter:image" content="https://i.ibb.co/DYFp9G1/Twitter-post.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
