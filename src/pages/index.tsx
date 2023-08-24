import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import type { FC } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoadingSpinner } from "@/ui/LoadingSpinner";

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
    return (
      <div className="my-20 flex w-full justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="grid gap-5">
      <div className="text-5xl font-bold">Hi {profile.name},</div>
      <TotalSpending />
      <AvailableBanks />
      <div className="grid grid-cols-2">
        <div className="md:col-span-1">
          <AllTransactions />
        </div>
      </div>
    </main>
  );
};

const AllTransactions = () => {
  const { isLoading, data } = api.transactions.getRecentTransactions.useQuery();

  if (isLoading || !data) {
    return null;
  }
  return (
    <div className="rounded-md bg-light-secondary p-3">
      <table className="w-full text-left ">
        <thead className="bg-light-accent text-center text-white">
          <th className="px-2">No.</th>
          <th className="px-2">Description</th>
          <th className="px-2">Amount</th>
          <th className="px-2">Account</th>
        </thead>
        <tbody className="">
          {data.map((transaction, idx) => (
            <tr
              className="divide-x divide-light-primary/30 odd:bg-light-accent/20 even:bg-light-secondary"
              key={transaction.id}
            >
              <td className=" px-3">{idx + 1}.</td>
              <td className=" px-3">
                {transaction.description?.substring(0, 100)}
              </td>
              <td className="px-3 text-center">
                ${Number(transaction.amount)}
              </td>
              <td className=" px-3">{transaction.bank?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AvailableBanks = () => {
  const { isLoading, data } = api.transactions.getAllBanks.useQuery();

  const router = useRouter();
  if (isLoading) {
    return null;
  }
  if (!data || data.length === 0)
    return (
      <div className="">
        <button
          onClick={() => void router.push("/accounts/create")}
          className="w-full rounded-md bg-light-accent py-2 text-xl font-semibold text-white transition hover:opacity-80"
        >
          It seems like you haven&apos;t setup any sources. You can create one
          here.
        </button>
      </div>
    );

  return (
    <div className="flex gap-3">
      {data.map((account) => (
        <Link
          href={`/accounts/${account.id}`}
          key={account.id}
          className="flex w-fit select-none items-center gap-2 rounded-md  bg-light-secondary px-3 py-1 transition hover:opacity-80"
        >
          <div className="flex flex-col items-center">
            <div className="w-fit  text-6xl">{account.emoji}</div>
            <div className="font-semibold">{account.name}</div>
          </div>
        </Link>
      ))}
      <Link
        href={"/accounts/create"}
        className="flex aspect-square h-full place-items-center justify-center rounded-md bg-light-secondary text-light-primary/40 hover:opacity-80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 stroke-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
    </div>
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
