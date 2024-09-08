import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';

// Connection setup with Alchemy
const ALCHEMY_API_KEY = 'AMfjI7mwc5HiXIffvgQK9dCsdOvozYVb';
const CONNECTION_URL = `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const connection = new Connection(CONNECTION_URL);

// Define the Metaplex Token Metadata Program ID
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm5cL6W8u1Xo88w3Pq8');

const retryWithBackoff = async (fn: () => Promise<any>, retries = 5, delay = 500) => {
    try {
        return await fn();  
    } catch (error) {
        if (retries === 0) throw error;
        if (error.message.includes('429')) {
            console.warn(`Server responded with 429. Retrying after ${delay}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryWithBackoff(fn, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
};

// Function to get SOL balance
export const getBalance = async (publicKey: string): Promise<number> => {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1e9; // Convert lamports to SOL
};

// Fetch Transaction History (Date, Time, Status, Amount)
export const getTransactionHistory = async (publicKey: string) => {
    const pubKey = new PublicKey(publicKey);
    const signatures = await retryWithBackoff(() => connection.getSignaturesForAddress(pubKey, { limit: 5 }));

    const transactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
            const transaction = await retryWithBackoff(() => connection.getParsedTransaction(signatureInfo.signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0, // Explicitly specify supported version
            }));

            const blockTime = transaction?.blockTime;
            const date = blockTime ? new Date(blockTime * 1000).toLocaleDateString() : 'Unknown';
            const time = blockTime ? new Date(blockTime * 1000).toLocaleTimeString() : 'Unknown';
            const status = transaction?.meta?.err ? 'Failed' : 'Success';

            let amount = 0;
            if (transaction?.transaction?.message?.instructions) {
                transaction.transaction.message.instructions.forEach((instruction: any) => {
                    if (instruction.programId.toBase58() === '11111111111111111111111111111111') {
                        if (instruction.parsed && instruction.parsed.type === 'transfer') {
                            if (instruction.parsed.info.source === pubKey.toBase58()) {
                                amount = -instruction.parsed.info.lamports / 1e9;
                            } else if (instruction.parsed.info.destination === pubKey.toBase58()) {
                                amount = instruction.parsed.info.lamports / 1e9;
                            }
                        }
                    }
                });
            }

            return { date, time, status, amount };
        })
    );

    return transactions;
};

export const getDetailedTransactionInfo = async (publicKey: string) => {
    const pubKey = new PublicKey(publicKey);
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 20 });

    const transactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
            const transaction = await connection.getParsedTransaction(signatureInfo.signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0, // Explicitly specify max supported transaction version
            });

            const blockTime = transaction?.blockTime;
            const date = blockTime ? new Date(blockTime * 1000).toLocaleDateString() : 'Unknown';
            const time = blockTime ? new Date(blockTime * 1000).toLocaleTimeString() : 'Unknown';
            const status = transaction?.meta?.err ? 'Failed' : 'Success';

            let amount = 0;
            let source = '';
            let destination = '';

            if (transaction?.transaction?.message?.instructions) {
                transaction.transaction.message.instructions.forEach((instruction: any) => {
                    if (instruction.programId.toBase58() === '11111111111111111111111111111111') {
                        if (instruction.parsed && instruction.parsed.type === 'transfer') {
                            if (instruction.parsed.info.source === pubKey.toBase58()) {
                                amount = -instruction.parsed.info.lamports / 1e9;
                                source = instruction.parsed.info.source;
                                destination = instruction.parsed.info.destination;
                            } else if (instruction.parsed.info.destination === pubKey.toBase58()) {
                                amount = instruction.parsed.info.lamports / 1e9;
                                source = instruction.parsed.info.source;
                                destination = instruction.parsed.info.destination;
                            }
                        }
                    }
                });
            }

            return {
                date,
                time,
                status,
                amount,
                source,
                destination,
                signature: signatureInfo.signature,
            };
        })
    );

    return transactions;
};

export const getTokenDistribution = async (publicKey: string) => {
    const pubKey = new PublicKey(publicKey);

    const solBalance = await connection.getBalance(pubKey);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });

    const tokens = tokenAccounts.value.map(tokenInfo => {
        const tokenAddress = tokenInfo.account.data.parsed.info.mint;
        const tokenAmount = tokenInfo.account.data.parsed.info.tokenAmount.uiAmount;
        return { tokenAddress, tokenAmount };
    });

    return {
        solBalance: solBalance / 1e9,
        tokens
    };
};

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CACHE_DURATION = 60000; // 60 seconds

let cache = {
    data: null,
    timestamp: 0
};

export const getSPLTokenPerformance = async () => {
    const now = Date.now();
    
    // Check if the cached data is still valid
    if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
    }

    const splTokenIds = [
        'solana', 'serum', 'raydium', 'msol', 'ftt', 
        'step-finance', 'orca', 'marinade', 'saber', 
        'cope', 'tulip-protocol', 'bonfida', 'kin', 
        'samoyedcoin', 'maps', 'media-network', 'stars-token', 
        'oxygen', 'port-finance'
    ]; // Replace with SPL token IDs

    try {
        const response = await axios.get(COINGECKO_API_URL, {
            params: {
                vs_currency: 'usd',
                ids: splTokenIds.join(','),
                order: 'market_cap_desc',
                per_page: splTokenIds.length, // Fetch up to the number of tokens in the array
                page: 1,
                price_change_percentage: '1h,24h,7d'
            }
        });
        cache = {
            data: response.data,
            timestamp: now
        };
        return response.data;
    } catch (error) {
        console.error('Error fetching token performance:', error);
        return [];
    }
};

// New function to send native SOL
export const sendSol = async (
    fromWallet: Keypair,
    toAddress: string,
    amount: number
): Promise<string> => {
    const toPublicKey = new PublicKey(toAddress);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toPublicKey,
            lamports: amount * 1e9 // Convert SOL to lamports
        })
    );

    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );
        return signature;
    } catch (error) {
        console.error('Error sending SOL:', error);
        throw error;
    }
};

// Function to generate QR code URL for an account
export const getQRCodeURL = (publicKey: string): string => {
    const baseURL = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
        size: '200x200',
        data: publicKey,
    });

    return `${baseURL}?${params.toString()}`;
};
