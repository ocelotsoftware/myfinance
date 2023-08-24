import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";

export default function Home() {
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
      <main>
        hi
      </main>
    </>
  );
}

