import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { FC, useEffect, useState } from "react";
import NavBar from "@/ui/navbar";
import { api } from "@/utils/api";

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

      {data ? <AuthHome userId={data.user.id} /> : <AnonHome />}
    </>
  );
}

const AuthHome = ({ userId }: { userId: string }) => {
  const { isLoading: isProfileLoading, data: profile } = api.user.get.useQuery({
    userId: userId,
  });

  if (isProfileLoading || !profile) {
    return <div>Loading....</div>;
  }

  return (
    <main className="grid gap-5">
      <div className="text-5xl font-bold">Hi {profile.name},</div>
      <TotalSpending />
    </main>
  );
};

const TotalSpending = () => {
  const { isLoading, data } = api.transactions.totalAmount.useQuery();
  return (
    <div>
      <div
        className={`  rounded-md bg-light-secondary ${
          isLoading ? "animate-pulse text-transparent" : ""
        } py-6 text-center font-semibold`}
      >
        <div className=" text-7xl">${data?.sum ?? 0}</div>
        <div className="text-2xl">{data?.count ?? 0} transactions</div>
      </div>
    </div>
  );
};

const AnonHome: FC = () => {
  return (
    <>
      <main className="my-32 grid gap-y-6">
        <div className="text-8xl font-bold">
          Welcome to <br /> MyFinance
        </div>
        <div className="max-w-[500px] text-2xl font-semibold ">
          Think of us as an online and digital piggy-bank tracker that you can
          use to keep track of various physical savings in one place, such as
          Wallets, Metro Cards or Gift Cards
        </div>
        <div className="grid gap-3 ">
          <button
            onClick={() => void signIn()}
            className="w-fit  rounded-md bg-light-primary px-7 py-2 text-xl font-semibold text-white transition hover:opacity-80"
          >
            Join Us
          </button>
        </div>
      </main>
    </>
  );
};
