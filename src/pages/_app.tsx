import "styles/globals.css";
import type { AppProps } from "next/app";
import { Chain, EthosConnectProvider } from "ethos-connect";
import Head from "next/head";
import { CustomToast, Sidebar } from "components";
import { SUI_RPC_URL } from "../utils";
import { Montserrat } from "next/font/google";


const font_montserrat = Montserrat({
    variable: "--montserrat-font",
    subsets: ["latin"],
    });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${font_montserrat.variable} font-sans`}>
      <Head>
        <title>¡hola sui! - nft staking platform</title>
        <meta property="og:title" content="hola! ola staking ola!" key="title" />
      </Head>

      <EthosConnectProvider
        ethosConfiguration={{
          chain: Chain.SUI_MAINNET, // Optional. Defaults to sui:devnet and sui:testnet - permanent testnet
          network: SUI_RPC_URL,
          hideEmailSignIn: true, // Optional.  Defaults to false
          preferredWallets: ["Suiet"],
        }}
      >
        <Sidebar>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </Sidebar>
      </EthosConnectProvider>
      <CustomToast />
    </div>
  );
}
