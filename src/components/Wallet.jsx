import React, { FC, useMemo } from 'react';
// import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui'; //added new
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
    // BackpackWalletAdapter,
    PhantomWalletAdapter, 
    SolflareWalletAdapter, 
    CoinbaseWalletAdapter,
    SalmonWalletAdapter, 
    MathWalletAdapter, 
    LedgerWalletAdapter,
    KeystoneWalletAdapter,
    UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Backpack } from '@mui/icons-material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

// import './Wallet.css';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

function Wallet({children}) {
// export const Wallet = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            // new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new SalmonWalletAdapter(),
            new MathWalletAdapter(),
            new LedgerWalletAdapter(),
            new KeystoneWalletAdapter(),
            // new UnsafeBurnerWalletAdapter(),
            // new BackpackWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        // <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100%'}}>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* <Navigation /> */}
                    {children}
                    {/* <WalletMultiButton /> */}
                    {/* <WalletDisconnectButton /> */}
                    { /* Your app's components go here, nested within the context providers. */ }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
        // </Box>
    );
};
export default Wallet;