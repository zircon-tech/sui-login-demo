import { authOptions } from "@/lib/auth";
import { mintNFT } from "@/lib/nft";
import prisma from "@/lib/prisma";
import { deriveUserSalt } from "@/lib/salt";
import { jwtToAddress } from "@mysten/zklogin";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest) {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, return an error
  if (!session || !session?.user?.email) {
    return NextResponse.json(
      {
        error: "Not authenticated",
      },
      { status: 401 }
    );
  }

  // get the user from the database
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
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
  const address = jwtToAddress(id_token as string, salt);

  console.log('address', address)
  console.log('email', session?.user?.email)

  await mintNFT(address);

  const nft = `https://suiscan.xyz/devnet/account/${address}`;

  return NextResponse.json(
    {
      address,
      nft,
    },
    { status: 200 }
  );
}
