import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function NavBar() {
  const { data } = useSession();

  return (
    <nav className="py-3 flex justify-between ">
      <Link href={"/"} className="text-3xl font-bold">
        MyFinance
      </Link>
      <div className="font-semibold">
        {data ? (
          <button
            onClick={() => void signOut()}
            className="rounded-md bg-light-primary px-5 py-2 text-white transition hover:opacity-90 hover:drop-shadow-2xl "
          >
            Sign Out
          </button>
        ) : (
          <>
            <button
              onClick={() => void signIn()}
              className="rounded-md bg-light-primary px-5 py-2 text-white transition hover:opacity-90 hover:drop-shadow-2xl "
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
