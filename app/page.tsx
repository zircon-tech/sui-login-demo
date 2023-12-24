// "use client";

import { Github } from "@/components/icons";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deriveUserSalt } from "@/lib/salt";
import { nFormatter } from "@/lib/utils";
import { jwtToAddress } from "@mysten/zklogin";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/Scale3-Labs/zklogin-demo",
    {
      ...(process.env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      // data will revalidate every 24 hours
      // next: { revalidate: 86400 },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));

  const session = await getServerSession(authOptions);

  // if the user is logged in, fetch their address
  let address = null;
  if (session !== null) {
    const email = session?.user?.email as string;

    // get the user from the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // get the account from the database
    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });

    // get the id_token from the account
    const id_token = account?.id_token;

    // get the salt from the id_token
    const salt = deriveUserSalt(id_token as string);

    // get the address from the id_token and salt
    address = jwtToAddress(id_token as string, salt);
  }

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        {session !== null && (
          <>
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[5rem]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              {`Welcome back, ${session?.user?.name}`}
            </h1>
            <div className="border-[1px] border-slate-300 rounded-lg px-3 py-4 flex flex-col gap-2 w-full">
              <p
                className="animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-lg"
                style={{
                  animationDelay: "0.25s",
                  animationFillMode: "forwards",
                }}
              >
                Your Sui address is:
              </p>
              <p
                className="font-mono text-sm text-gray-700 animate-fade-up text-center opacity-0 [text-wrap:balance]"
                style={{
                  animationDelay: "0.25s",
                  animationFillMode: "forwards",
                }}
              >
                {address}
              </p>
            </div>
          </>
        )}
        {session === null && (
          <>
            {" "}
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-6xl md:leading-[5rem]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              Mith ZK Login Demo App
            </h1>
            <p
              className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              A demo application to showcase zkLogin authentication.
            </p>
          </>
        )}
      </div>
    </>
  );
}
