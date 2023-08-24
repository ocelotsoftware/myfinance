import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { useState, type FC, useEffect } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoadingSpinner } from "@/ui/LoadingSpinner";
import * as Dialog from "@radix-ui/react-dialog";
import { number } from "zod";

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
      <CreateTransactions />
      <div className="grid grid-cols-2">
        <div className="md:col-span-1">
          <AllTransactions />
        </div>
      </div>
    </main>
  );
};

const CreateTransactions = () => {
  const { isLoading, data } = api.transactions.getAllBanks.useQuery();
  const [chosenType, setChosenType] = useState("loss");

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [affectedAccount, setAffectedAccount] = useState<number | null>(null);
  const [transferredAccount, setTransferredAccount] = useState<number | null>(
    null
  );
  const addingTransaction = api.transactions.createNewTransaction.useMutation({
    onSuccess: () => {
      alert("Transaction has been recorded");
    },
  });

  const createNewTransaction = () => {
    if (affectedAccount !== null) {
      if (chosenType === "transfer" && transferredAccount !== null) {
        addingTransaction.mutate({
          amount: amount,
          bankId: affectedAccount,
          description: description,
          type: chosenType,
          transferredBankId: transferredAccount,
        });
      } else {
        addingTransaction.mutate({
          amount: amount,
          bankId: affectedAccount,
          description: description,
          type: chosenType,
          transferredBankId: null,
        });
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>hi</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <div className="absolute left-0 top-0 h-screen w-full bg-black/30 backdrop-blur-sm"></div>
          </Dialog.Overlay>
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-light-accent p-[25px] text-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:max-w-[450px]">
            <Dialog.Title className="text-3xl font-bold">
              Add Transactions
            </Dialog.Title>
            <Dialog.Description>
              <div>
                Here you can record money being gained, spent or loaned.
              </div>
              <div className="my-3 grid gap-y-3">
                <input
                  onChange={(e) => setAmount(e.target.valueAsNumber)}
                  required
                  type="number"
                  placeholder="Amount ($)"
                  className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70"
                />
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70"
                  placeholder="Describe your transaction"
                />
                <div className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70">
                  <select
                    onChange={(e) => setAffectedAccount(Number(e.target.value))}
                    className="w-full bg-transparent outline-none"
                  >
                    {data?.map((bank) => (
                      <option value={bank.id} key={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={chosenType === "profit"}
                    onClick={() => void setChosenType("profit")}
                    className={`w-full rounded-md ${
                      chosenType === "profit" ? "opacity-70" : ""
                    } bg-green-500 py-2 text-center  font-semibold`}
                  >
                    Profit
                  </button>
                  <button
                    disabled={chosenType === "loss"}
                    onClick={() => void setChosenType("loss")}
                    className={`w-full rounded-md ${
                      chosenType === "loss" ? "opacity-70" : ""
                    } bg-red-500 py-2 text-center  font-semibold`}
                  >
                    Loss
                  </button>
                  {(data?.length ?? 0) > 1 ? (
                    <button
                      disabled={chosenType === "transfer"}
                      onClick={() => void setChosenType("transfer")}
                      className={`w-full rounded-md ${
                        chosenType === "transfer" ? "opacity-70" : ""
                      } bg-yellow-500 py-2 text-center  font-semibold`}
                    >
                      Transfer
                    </button>
                  ) : null}
                </div>
                {chosenType === "transfer" ? (
                  <div className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70">
                    <select
                      onChange={(e) =>
                        setTransferredAccount(Number(e.target.value))
                      }
                      className="w-full bg-transparent outline-none"
                    >
                      {data
                        ?.filter((item) => item.id !== affectedAccount)
                        .map((bank) => (
                          <option value={bank.id} key={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : null}
                <div>
                  <button
                    onClick={() => void createNewTransaction()}
                    className="w-full rounded-md bg-light-secondary/20 py-2 font-semibold uppercase  transition hover:bg-light-secondary/30"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
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
        <thead className="text-center text-white">
          <th className="rounded-tl-md bg-light-accent px-2 ">No.</th>
          <th className="bg-light-accent px-2 ">Description</th>
          <th className="bg-light-accent px-2 ">Amount</th>
          <th className="rounded-tr-md bg-light-accent px-2">Account</th>
        </thead>
        <tbody className="">
          {data.map((transaction, idx) => (
            <tr
              className="divide-x divide-light-primary/10 odd:bg-light-accent/20 even:bg-light-secondary"
              key={transaction.id}
            >
              <td className=" px-3">{idx + 1}.</td>
              <td className=" px-3">
                {transaction.description?.substring(0, 100)}
                {(transaction.description?.length ?? 0) > 100 ? "..." : ""}
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
    <div className="flex flex-wrap gap-3">
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
