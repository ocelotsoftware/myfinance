import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  return {
    props: { session },
  };
};

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>MyFinance</title>
        <meta
          name="description"
          content="MyFinance is an online piggy bank tracker that lets you see how much funds you have and keep track of your expenses."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-full place-items-center justify-center">
        {data ? (
          <button onClick={() => void signOut()}>sign out</button>
        ) : (
          <button onClick={() => void signIn()}>sign in</button>
        )}
      </main>
    </>
  );
}
