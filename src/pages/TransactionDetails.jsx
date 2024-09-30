import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Paper, 
  Stack, 
  CircularProgress, 
  Button, 
  Tabs, 
  Tab, 
  Box 
} from "@mui/material";
import { sendTransactionData } from '../utils/api';
import TransactionContext from '../components/TransactionContext';
import NativeBalanceChanges from '../components/NativeBalanceChanges';
import TokenBalanceChanges from '../components/TokenBalanceChanges';
import Instructions from '../components/Instructions';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TransactionDetails() {
  const { signature } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        const data = await sendTransactionData(signature, '__NULL__');
        setTransactionData(data);
        console.log("Transaction Data:", data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setError('Failed to fetch transaction data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [signature]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack alignItems="center" spacing={2}>
      <Paper sx={{ padding: 3, margin: 3, width: "100%" }}>
        <Typography variant="h5" sx={{textAlign: 'center', marginBottom: 2 }}>Transaction Details</Typography>
        <Typography>Signature: {signature}</Typography>
        {transactionData && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="transaction details tabs">
                <Tab label="Transaction Context" />
                <Tab label="Native Balance Changes" />
                <Tab label="Token Balance Changes" />
                <Tab label="Instructions" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <TransactionContext context={transactionData[0]} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
          {transactionData && transactionData[0].allBalanceChanges && (
            <>
              {/* {console.log("Native Balance Changes Data:", transactionData[0].allBalanceChanges)} */}
              <NativeBalanceChanges changes={transactionData[0].allBalanceChanges} />
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {transactionData && transactionData[0].allTokenBalanceChanges && (
            <>
              {console.log("Token Balance Changes Data:", transactionData[0].allTokenBalanceChanges)}
              <TokenBalanceChanges changes={transactionData[0].allTokenBalanceChanges} />
            </>
          )}
        </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Instructions instructions={transactionData.slice(1)} />
            </TabPanel>
          </>
        )}
      </Paper>
      <Button component={Link} to="/explorer" variant="contained">Back to Explorer</Button>
    </Stack>
  );
}

export default TransactionDetails;