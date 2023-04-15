import LargeHeader from "\u0016\u0016@component/components/LargeHeader";
import Narbar from "\u0016\u0016@component/components/Navbar";
import ItenList from "\u0016\u0016@component/components/ItemList";
import Head from "next/head";
import Base from "\u0016\u0016@component/components/Base";
export default function Home() {
  return (
    <>
      <Base>
        <Head>
          <title>EasyFund</title>
        </Head>
        <Narbar />
        <LargeHeader />
        <ItenList />
      </Base>
    </>
  );
}
