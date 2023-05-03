import "styles/globals.css";
import type { AppProps } from "next/app";
import { Chain, EthosConnectProvider } from "ethos-connect";
import { Sidebar } from "components/Layout/Sidebar";
import Head from "next/head";
import { CustomToast } from "../components/Alert/CustomToast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>¡hola sui! - nft staking platform</title>
        <meta property="og:title" content="hola! ola staking ola!" key="title" />
      </Head>

      <EthosConnectProvider
        ethosConfiguration={{
          chain: Chain.SUI_TESTNET, // Optional. Defaults to sui:devnet and sui:testnet - permanent testnet
          network: "https://rpc-testnet.suiscan.xyz:443", //</div> //"https://node.shinami.com:443/api/v1/sui_testnet_45849571a73265b75e2918f4f8a9c1fc", // Optional. Defaults to https://fullnode.devnet.sui.io/
          hideEmailSignIn: true, // Optional.  Defaults to false
        }}
      >
        <Sidebar>
          <Component {...pageProps} />
        </Sidebar>
      </EthosConnectProvider>
      <CustomToast />
    </div>
  );
}
