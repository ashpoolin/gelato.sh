import { Card, CardContent, CardMedia, Typography, Link, Paper, Stack } from "@mui/material";
import ws_img from "../assets/whale-on-a-damn-scale.png";

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
 A Collection of research articles related to blockchain privacy, networks, and on-chain analysis. 
 </Typography> 
 
 <Stack spacing={2}> 
 <Card variant="outlined"> 
 {/* <CardMedia 
 component="img" 
 height="300" 
 image={ws_img} // Replace with your image URL 
 alt="Image 1" 
 /> */}
 <CardContent> 
 <Typography variant="h6" component="div"> 
 {/* <Link component={RouterLink} to="/research/whalescale"> */}
 <Link href="/whalescale"> 
 WhaleScale
 </Link> 
 </Typography> 
 <Typography variant="body2"> 
 Adapting the PageRank algorithm to analyzing cryptocurrency token networks. 
 </Typography> 
 </CardContent> 
 </Card> 
 
 <Card variant="outlined"> 
 {/* <CardMedia 
 component="img" 
 height="140" 
 image="image2.jpg" // Replace with your image URL 
 alt="Image 2" 
 /> */}
 <CardContent> 
 <Typography variant="h6" component="div"> 
 <Link href="/fingerprinting"> 
 SPL Token Account Fingerprinting
 </Link> 
 </Typography> 
 <Typography variant="body2"> 
 Deanonymizing Exchange Wallets Using Token Account Fingerprinting 
 </Typography> 
 </CardContent> 
 </Card> 

 <Card variant="outlined"> 
 {/* <CardMedia 
 component="img" 
 height="140" 
 image="image2.jpg" // Replace with your image URL 
 alt="Image 2" 
 /> */}
 <CardContent> 
 <Typography variant="h6" component="div"> 
 <Link href="/chainsplainoor"> 
    Chainsplain.me
 </Link> 
 </Typography> 
 <Typography variant="body2"> 
 AI-augmented interpretation layer for the Solana blockchain data.
 </Typography> 
 </CardContent> 
 </Card> 
 
 {/* <Card variant="outlined"> 
 <CardMedia 
 component="img" 
 height="140" 
 image="image3.jpg" // Replace with your image URL 
 alt="Image 3" 
 /> 
 <CardContent> 
 <Typography variant="h6" component="div"> 
 <Link href="article3.html">Title 3</Link> 
 </Typography> 
 <Typography variant="body2"> 
 Description for Title 3 
 </Typography> 
 </CardContent> 
 </Card>*/}
 </Stack> 
 </Stack> 
 </Paper> 
 ); 
} 
 
export default Research;