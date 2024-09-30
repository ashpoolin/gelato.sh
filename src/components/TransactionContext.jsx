import React, { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton, Tooltip } from '@mui/material';

function TransactionContext({ context }) {
  const [copySuccess, setCopySuccess] = useState('');

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2').replace(',', '');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  const renderTableRow = (label, value, copyable = false) => (
    <TableRow>
      <TableCell component="th" scope="row">{label}:</TableCell>
      <TableCell>
        {value !== undefined ? value.toString() : 'N/A'}
        {copyable && (
          <Tooltip title={copySuccess || "Copy to clipboard"} placement="top" arrow>
            <IconButton
              onClick={() => copyToClipboard(value)}
              size="small"
              sx={{ ml: 1, p: 0 }}
            >
              📋
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Paper sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>Transaction Context</Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {renderTableRow("Signature", context.signature, true)}
            {renderTableRow("Tx Version", context.data?.version)}
            {renderTableRow("Slot", context.slot)}
            {renderTableRow("Blocktime", formatDate(context.blockTime))}
            {renderTableRow("Error", context.err || 'None')}
            {renderTableRow("Fee", context.fee)}
            {renderTableRow("Compute Units Consumed", context.data?.meta?.computeUnitsConsumed)}
            {renderTableRow("Recent Blockhash", context.data?.transaction?.message?.recentBlockhash)}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1" sx={{ padding: 2 }}>Log Messages:</Typography>
      <ul style={{ maxHeight: '200px', overflowY: 'auto', padding: '0 16px' }}>
        {context.data?.meta?.logMessages?.map((message, index) => (
          <li key={index}>{message}</li>
        )) || <li>No log messages available</li>}
      </ul>
    </Paper>
  );
}

export default TransactionContext;