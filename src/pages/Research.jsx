import { Paper, Stack, Typography, Card, CardActions, CardContent, CardMedia, Button } from "@mui/material";

import graphImg from '../assets/network_stock_img.png'
 
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
      <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="deposit address reuse"
        height="140"
        image={graphImg}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Deposit Address Reuse - Part 1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Deposit Address Reuse (DAR) can tell us a lot about entities on the blockchain. 
          See how we apply it to follow the biggest accounts on Solana.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href="https://twitter.com/intent/tweet?&related=twitterapi%2Ctwitter&text=Hello%20world&url=https%3A%2F%2Fgelato.sh%2Fdar_pt1">Share</Button>
        
        <Button size="small" href="dar_pt1">Learn More</Button>
      </CardActions>
    </Card>
        {/* <Typography variant="h5">Research</Typography> */}
        {/* <Typography> */}
          {/* In 2023 we will share research related to on-chain analysis, showing */}
          {/* how it can be applied to inform trading decisions. */}
        {/* </Typography> */}
        {/* <ul> */}
          {/* <li> */}
            {/* Wallet clustering/identification via exchange deposit address reuse */}
            {/* (DAR) */}
          {/* </li> */}
          {/* <li>Whale/insider wallet watching</li> */}
          {/* <li>Scripting and automation for wallet watching</li> */}
        {/* </ul> */}
      </Stack>
    </Paper>
  );
}

export default Research;
