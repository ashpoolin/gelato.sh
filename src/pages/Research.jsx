import { Paper, Stack, Typography } from "@mui/material";

function Research() {
  return (
    <Paper
      sx={{
        padding: 3,
        margin: 3,
        width: "100%",
        minHeight: "70vh",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5">Research</Typography>
        <Typography>
          In 2023 we will share research related to on-chain analysis, showing
          how it can be applied to inform trading decisions.
        </Typography>
        <ul>
          <li>
            Wallet clustering/identification via exchange deposit address reuse
            (DAR)
          </li>
          <li>Whale/insider wallet watching</li>
          <li>Scripting and automation for wallet watching</li>
        </ul>
      </Stack>
    </Paper>
  );
}

export default Research;
