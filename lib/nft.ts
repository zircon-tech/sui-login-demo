import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { requestSuiFromFaucetV0, getFaucetHost } from "@mysten/sui.js/faucet";

const TEST_MNEMONIC = 'protect target slush tenant tonight talk place consider hope ridge brush sun';

export const mintNFT = async (toAddress: string) => {
  try {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });

    // Create keypair
    const keypair = Ed25519Keypair.deriveKeypair(TEST_MNEMONIC, `m/44'/784'/0'/0'/0'`);
    const mintFrom = keypair.getPublicKey().toSuiAddress();

    // Get Sui from faucet
    // Try to get tokens from the Devnet faucet server
    try {
        const fund = await requestSuiFromFaucetV0({
            // connect to Devnet
            host: getFaucetHost('devnet'),
            recipient: mintFrom,
        });
        console.log(fund)
    } catch (error) {
        console.log('Error getting Sui from faucet. Continue anyway.')
    }

    // Call to Mint NFT
    const packageObjectId = "0xa7f08901cd77492181ee56508978468a172298d0ad5b6ebb64576d7d130f083f";
    const tx = new TransactionBlock();
    // tx.setGasBudget(1000000);
    tx.moveCall({
      target: `${packageObjectId}::nft::mint`,
      arguments: [
        tx.pure.string("MITH Demo NFT"),
        tx.pure.string("A MITH NFT Demo on the Sui Blockchain"),
        tx.pure.string("https://develop-profile-picture.s3.amazonaws.com/mith.png"),
        tx.pure.address(toAddress),
      ],
      typeArguments: [],

    });
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
    });
    console.log('result');
    console.log({ result });

  } catch (error) {
    console.log("Sui client error:", error);
    throw error;
  }
};
