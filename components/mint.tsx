"use client";
import React, { useState } from 'react';

const LoadingIndicator = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white-500"></div>
        </div>
    );
};

const MithNft = ({ nft }: { nft: string }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-3 animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:leading-[5rem]">
            <h3 className="text-xl font-bold mb-3 font-mono">NFT minted successfully</h3>
            <img src="https://develop-profile-picture.s3.amazonaws.com/mith.png" alt="NFT" className="w-1/2" />
            <a target='blank' href={nft} className="text-xl text-gray-700 font-mono mt-3" style={{ textDecoration: 'underline', color: '#2663eb' }}>View your nfts</a>
        </div>
    );
}

const Mint = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [nft, setNft] = useState('');

    const handleMintNFT = async () => {
        try {
            setIsLoading(true);

            // Make API call to mint NFT
            const response = await fetch('/api/nft', {
                method: 'POST',
            });

            if (response.ok) {
                console.log('NFT minted successfully!');
                const data = await response.json();
                console.log('NFT:', data);
                setNft(data.nft);
            } else {
                console.error('Failed to mint NFT');
            }
        } catch (error) {
            console.error('Error minting NFT:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (nft) {
        return <MithNft nft={nft} />;
    }

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleMintNFT} disabled={isLoading}>
            {isLoading ? <LoadingIndicator /> : 'Mint my NFT'}
        </button>
    );
};

export default Mint;


