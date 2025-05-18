'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState, useMemo } from 'react';
import { createJupiterApiClient } from '../..';
import Button from './ui/button';

interface TokenBalance {
  mint: string;
  amount: string;
}

export default function SwapForm() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [fromMint, setFromMint] = useState<string>('');
  const [toMint, setToMint] = useState<string>('');
  const jupiter = useMemo(() => createJupiterApiClient(), []);

  const handleSwap = async () => {
    if (!publicKey || !fromMint || !toMint) return;
    try {
      const quote = await jupiter.quoteGet({
        inputMint: fromMint,
        outputMint: toMint,
        amount: 1,
      });
      console.log('Quote', quote);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    const tokenProgramId = new PublicKey(
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    const token2022ProgramId = new PublicKey(
      'TokenzQdQszrUVXHBZiE3JhiEpAc2wHLDsBdGrJ4ETAS'
    );

    (async () => {
      const standard = await connection.getParsedTokenAccountsForOwner(publicKey, {
        programId: tokenProgramId,
      });
      const t2022 = await connection.getParsedTokenAccountsForOwner(publicKey, {
        programId: token2022ProgramId,
      });
      const all = [...standard.value, ...t2022.value].map((acc) => {
        const info = acc.account.data.parsed.info;
        return { mint: info.mint, amount: info.tokenAmount.uiAmountString };
      });
      setTokens(all);
    })();
  }, [publicKey, connection]);

  return (
    <form className="space-y-4">
      <div>
        <label className="block mb-1">From Token</label>
        <select
          className="border p-2 rounded w-full"
          value={fromMint}
          onChange={(e) => setFromMint(e.target.value)}
        >
          <option value="">Select token</option>
          {tokens.map((t) => (
            <option key={t.mint} value={t.mint}>
              {t.mint} - {t.amount}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">To Token</label>
        <select
          className="border p-2 rounded w-full"
          value={toMint}
          onChange={(e) => setToMint(e.target.value)}
        >
          <option value="">Select token</option>
          {tokens.map((t) => (
            <option key={t.mint} value={t.mint}>
              {t.mint} - {t.amount}
            </option>
          ))}
        </select>
      </div>
      <Button type="button" onClick={handleSwap}>Swap</Button>
    </form>
  );
}
