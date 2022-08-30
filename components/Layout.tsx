import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>CZAR+ Web chat</title>
        <meta name="description" content="Czar+ Web chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>{children}</div>
      </main>
    </>
  );
}
