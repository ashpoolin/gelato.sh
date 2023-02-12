// import { FormControl, InputLabel, NativeSelect } from '@mui/material'
// import { Select, MenuItem, FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  NativeSelect,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import React, { useState, useEffect, useRef } from "react";

function Spl() {

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          padding: 3,
          margin: 3,
          textAlign: "center",
          width: "100%",
          minHeight: "100%",
          // minHeight: "70vh",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5">
            SPL Tokens: coming soon... Still!
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Spl;
