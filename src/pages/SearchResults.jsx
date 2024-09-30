import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { Connection, PublicKey } from '@solana/web3.js';

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processQuery = async () => {
      setLoading(true);
      setError(null);

      try {
        if (query.length > 50) {
          // Assume it's a transaction signature
          navigate(`/explorer/tx/${query}`);
        } else {
          // Assume it's an address
          // Validate the address
          const connection = new Connection(process.env.REACT_APP_HELIUS_RPC_URL, 'confirmed');
          const publicKey = new PublicKey(query);
          await connection.getAccountInfo(publicKey);
          navigate(`/explorer/address/${query}`);
        }
      } catch (err) {
        setError('Invalid address or transaction signature: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    processQuery();
  }, [query, navigate]);

  if (loading) {
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center">
        <Paper sx={{ padding: 3, margin: 3, width: "100%" }}>
          <Typography variant="h5" color="error" sx={{ marginBottom: 2 }}>Error</Typography>
          <Typography>{error}</Typography>
        </Paper>
      </Stack>
    );
  }

  // This should not be reached normally, as we're redirecting in the useEffect
  return null;
}

export default SearchResults;