import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Connection, PublicKey } from '@solana/web3.js';
import { 
  Typography, 
  Paper, 
  Stack, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  Link
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

function AddressResults() {
  const { query } = useParams();
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transactions');
  const theme = useTheme();

  useEffect(() => {
    const fetchSignatures = async () => {
      setLoading(true);
      setError(null);

      try {
        const connection = new Connection(process.env.REACT_APP_HELIUS_RPC_URL, 'confirmed');
        const address = new PublicKey(query);
        const sigs = await connection.getSignaturesForAddress(address, { limit: 20 });
        setSignatures(sigs);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();
  }, [query]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const abbreviateSignature = (signature) => {
    return `${signature.slice(0, 6)}...${signature.slice(-6)}`;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack alignItems="center">
      <Paper sx={{ padding: 3, margin: 3, width: "100%" }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Address: {query}</Typography>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Recent Transactions" value="transactions" />
          <Tab label="Transfers" value="transfers" disabled />
          <Tab label="Balance Changes" value="balances" disabled />
        </Tabs>
        {activeTab === 'transactions' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Signature</TableCell>
                  <TableCell>Slot</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signatures.map((sig, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatTimestamp(sig.blockTime)}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/explorer/tx/${sig.signature}`}
                        color="secondary"
                        sx={{ 
                          color: theme.palette.secondary.main,
                          '&:hover': {
                            color: theme.palette.secondary.dark,
                          },
                        }}
                      >
                        {abbreviateSignature(sig.signature)}
                      </Link>
                    </TableCell>
                    <TableCell>{sig.slot}</TableCell>
                    <TableCell>{sig.err ? 'True' : 'False'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {activeTab === 'transfers' && (
          <Typography sx={{ padding: 2 }}>Transfer data will be displayed here.</Typography>
        )}
        {activeTab === 'balances' && (
          <Typography sx={{ padding: 2 }}>Balance change data will be displayed here.</Typography>
        )}
      </Paper>
      <Button onClick={() => navigate('/explorer')} variant="contained">Back to Search</Button>
    </Stack>
  );
}

export default AddressResults;