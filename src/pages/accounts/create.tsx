import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

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
            Imagine a transactions account like a piggy bank, where you actually
            put your money. This will help you organize your spending as they
            will all belong to specific accounts{" "}
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
                className=" input grow  text-xl "
                placeholder="Name your account"
                maxLength={24}
              />
            </div>
          </div>
          <textarea
            name="description"
            rows={5}
            className="input  resize-none text-lg"
            placeholder="Description (Optional)"
          ></textarea>
        </div>
      </main>
    </>
  );
}

export default CreateAccount;
