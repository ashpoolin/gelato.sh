import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Stack, TextField, Button } from "@mui/material";
import { sendTransactionData } from '../utils/api';

function Explorer() {
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
  
    const handleInputChange = (event) => {
      setSearchInput(event.target.value);
    };
  
    const handleSearch = async (e) => {
      e.preventDefault();
      if (searchInput.length > 0) {
        if (searchInput.length > 50) {
          try {
            await sendTransactionData(searchInput, '__NULL__');
            navigate(`/explorer/tx/${searchInput}`);
          } catch (error) {
            console.error('Error processing transaction:', error);
            // Handle error (e.g., show an error message to the user)
          }
        } else {
          navigate(`/explorer/address/${searchInput}`);
        }
      }
    };

  return (
    <Stack alignItems="center">
      <Paper
        sx={{
          padding: 3,
          margin: 3,
          textAlign: "center",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Gelato.sh Lite Explorer</Typography>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Enter address or transaction signature"
            variant="outlined"
            sx={{ width: '60%', marginRight: 1 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </form>
      </Paper>
    </Stack>
  );
}

export default Explorer;