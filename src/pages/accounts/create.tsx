import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { api } from "@/utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  return {
    props: { session },
  };
};

function CreateAccount() {
  const { data } = useSession();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState("😀");
  const [typeChosen, setTypeChosen] = useState("wallet");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const myAccount = api.transactions.createBank.useMutation();

  const handleSubmit = () => {
    myAccount.mutate({
      description,
      emoji,
      name,
      type: typeChosen,
    });
  };

  if (myAccount.isSuccess) {
    return (
      <div className="mx-auto my-32 grid w-fit gap-y-3 text-center">
        <div className="text-3xl font-bold">Your account has been created</div>
        <Link
          href="/"
          className="text-light-primary transition hover:opacity-80"
        >
          Go Back
        </Link>
      </div>
    );
  }

  if (myAccount.isLoading) {
    return (
      <div className="flex w-full place-items-center justify-center py-10">
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-light-primary text-light-secondary "
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        You are not signed in. Please sign in{" "}
        <Link
          className="text-blue-700 transition hover:opacity-90"
          href={"/auth/login"}
        >
          here
        </Link>
        .
      </div>
    );
  }

  const typesOfAccounts = [
    {
      name: "Wallet",
      code: "wallet",
    },
    {
      name: "Transit Card",
      code: "transit",
    },
    {
      name: "Savings Account",
      code: "savings",
    },
    {
      name: "Piggy Bank",
      code: "piggy",
    },
    {
      name: "Allowance",
      code: "allowance",
    },
    {
      name: "Income",
      code: "income",
    },
    {
      name: "College Funds",
      code: "college",
    },
    {
      name: "Business Account",
      code: "business",
    },
    {
      name: "Miscellaneous...",
      code: "miscellaneous",
    },
  ];

  return (
    <>
      <Head>
        <title>Create Account | MyFinance</title>
      </Head>
      <main className="grid gap-y-5">
        <div className=" flex items-center gap-3 font-semibold">
          <Link href={"/accounts"} className="hover:underline">
            Accounts
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <div className="">Create</div>
        </div>
        <div className="grid gap-y-2">
          <div className="text-5xl font-bold">
            Create a new transactions account
          </div>
          <div>
            Imagine a transactions account like a piggy bank or money jar, where
            the money you receive will actually sit. This will help you organize
            your spending as they will all belong to specific accounts{" "}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex  w-full gap-x-2">
            <div className="">
              <button
                onClick={() => void setOpenEmojiPicker((prev) => !prev)}
                className="mr-7 aspect-square h-full rounded-md bg-light-secondary text-2xl"
              >
                {emoji.toString()}
              </button>
              {openEmojiPicker ? (
                <>
                  {" "}
                  <div className="absolute z-20 translate-y-1">
                    <EmojiPicker
                      skinTonesDisabled
                      onEmojiClick={(e) => {
                        setEmoji(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                  <div
                    className="absolute left-0 top-0 z-10 h-full w-full "
                    onClick={() => void setOpenEmojiPicker(false)}
                  ></div>
                </>
              ) : null}
            </div>
            <div className="grow">
              <input
                type="text"
                className=" input w-full grow text-xl "
                placeholder="Name your account"
                maxLength={24}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <textarea
            name="description"
            rows={5}
            className="input  resize-none text-lg"
            placeholder="Description (Optional)"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="grid grid-cols-2 flex-wrap gap-2 md:flex md:gap-3">
            {typesOfAccounts.map((type, key) => (
              <button
                disabled={typeChosen === type.code}
                onClick={() => void setTypeChosen(type.code)}
                key={key}
                className={`grid transition ${
                  typeChosen === type.code
                    ? "bg-light-accent text-light-secondary/90"
                    : "bg-light-secondary text-light-accent/60"
                }  items-center rounded-md px-16 py-2  text-center  text-lg font-semibold  `}
              >
                {type.name}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={() => void handleSubmit()}
              className="w-full rounded-md bg-light-primary py-3.5 text-xl font-semibold uppercase text-white transition hover:opacity-70"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default CreateAccount;
