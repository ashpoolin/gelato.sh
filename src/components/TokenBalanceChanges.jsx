import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function TokenBalanceChanges({ changes }) {
  const theme = useTheme();

  console.log("TokenBalanceChanges received props:", changes);

  const abbreviateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-6)}` : 'N/A';
  };

  if (!changes || !Array.isArray(changes) || changes.length === 0) {
    return (
      <Paper sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}>
        <Typography variant="h6">Token Balance Changes</Typography>
        <Typography>No token balance changes available.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center' }}>Token Balance Changes</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Mint</TableCell>
              <TableCell>Pre Balance</TableCell>
              <TableCell>Post Balance</TableCell>
              <TableCell>Change Balance</TableCell>
              <TableCell>Is Owner</TableCell>
              <TableCell>Is Signer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.map((change, index) => {
              console.log(`Change at index ${index}:`, change);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/explorer/address/${change.pubkey}`}
                      color="secondary"
                      sx={{ 
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          color: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      {abbreviateAddress(change.pubkey)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/explorer/address/${change.mint}`}
                      color="secondary"
                      sx={{ 
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          color: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      {abbreviateAddress(change.mint)}
                    </Link>
                  </TableCell>
                  <TableCell>{change.preBalance}</TableCell>
                  <TableCell>{change.postBalance}</TableCell>
                  <TableCell>{change.changeBalance}</TableCell>
                  <TableCell>{change.isOwner ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{change.isSigner ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TokenBalanceChanges;