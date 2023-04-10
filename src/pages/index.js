import LargeHeader from "\u0016\u0016@component/components/LargeHeader";
import Narbar from "\u0016\u0016@component/components/Navbar";
import ItenList from "\u0016\u0016@component/components/ItemList";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>EasyFund</title>
      </Head>
      <Narbar />
      <LargeHeader />
      <ItenList />
    </>
  );
}
