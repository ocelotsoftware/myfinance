import React from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import Head from "next/head";

function LoginPage({
  providers,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Login | MyFinance</title>
      </Head>
      <div className="absolute left-0 top-0 flex h-screen w-full place-items-center justify-center ">
        <div className="w-[80vw]  rounded-md bg-light-secondary py-8 md:w-[400px] md:px-4">
          <div className="text-3xl font-bold  mb-10">Sign In</div>
          <div className="text-red-700">{error}</div>
          <div className="mt-5 grid gap-y-3 ">
            {Object.values(providers).map((provider, key) => (
              <div key={key}>
                <button
                  onClick={() => void signIn(provider.id)}
                  className="w-full rounded-md bg-light-accent/60 py-2.5 font-semibold text-white transition hover:bg-light-accent/80"
                >
                  Sign In with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const errorCode = context.query?.error ?? null;
  let error = null;

  switch (errorCode) {
    case "OAuthAccountNotLinked":
      error =
        "Please login using the same provider you created the account with";
      break;
    default:
      error = errorCode;
      break;
  }

  if (session) {
    return { redirect: { destination: "/" } };
  }
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [], error: error },
  };
}
