import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Instructions({ instructions }) {
  return (
    <Paper sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>Instructions</Typography>
      {instructions.map((instruction, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${instruction[0].program}::${instruction[0].type}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(instruction[0]).map(([key, value]) => (
              key !== 'program' && key !== 'type' && (
                <Typography key={key}>
                  <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
                </Typography>
              )
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}

export default Instructions;