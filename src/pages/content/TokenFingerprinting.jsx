import { Card, CardContent, CardMedia, Typography, Link, Paper, Stack, Tab, Table } from "@mui/material"; 
import fingerprint from "../../assets/fingerprint_example.png";

function TokenFingerprinting() { 
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
 <Typography variant="h4">Deanonymizing Exchange Wallets Using Token Account Fingerprinting</Typography> 
 <Typography variant="h5">Introduction</Typography> 
 <Typography>This article presents a method for identifying and labeling exchange wallets on the Solana blockchain by examining their SPL (Solana Program Library) token accounts. While wallet interactions with ERC-20 contracts on Ethereum 
have been extensively studied, Solana's account-based model requires a different approach. Each token on Solana has a corresponding token account, and a wallet can be the "owner" of multiple SPL token accounts. By considering these token accounts in their entirety, we form a unique "fingerprint" that is expressed by the owner's preferences for specific tokens, protocols, and teams. </Typography> 
 <Typography variant="h5">SPL Tokens</Typography> 
 <Typography>What is a Solana SPL token account, and why is a token account necessary for transferring tokens to an owner's wallet? A Solana SPL token account is a specialized account that holds a specific token on the Solana blockchain. Each SPL token requires a corresponding token account to store the token's data, including balance, ownership, and other
related information. Before transferring a token to an owner's wallet, a token account must be created to hold and manage that token.</Typography> 
 <Typography variant="h5">Token Account Fingerprinting</Typography> 
 <Typography>In this context, a "fingerprint" refers to a list of non-spam token mints represented by their base58 identifiers. This list represents the tokens owned by a particular wallet. The question arises: How can we statistically 
link this fingerprint to another list of published holdings? For example, how can we compare it to a list of trading pairs on an exchange or a VC portfolio? While we have not extensively explored these methods, here are a few 
techniques that can establish a statistical link and provide a measure of certainty or confidence between the fingerprint and potential owners:
 <ol>
 <li>The Eyeball Technique: The method used in this article involves comparing token lists to identify meaningful overlaps.</li>
 <li>String Comparison Algorithms: String comparison algorithms like Jaccard similarity, Levenshtein distance, or cosine similarity can analyze the similarity between two sets of strings (token IDs) and provide a similarity 
 score. A higher score indicates a higher likelihood of a match.</li>
 <li>Data Mining Techniques: Implement data mining techniques such as clustering or association rule learning to identify patterns and relationships within the token lists. Clustering algorithms group similar tokens, while 
 association rule learning reveals associations between tokens.</li>
 <li>Machine Learning Classification Models: Train machine learning models on labeled datasets, where labels represent matches or non-matches. These models can predict whether a new token list matches published holdings based on
 learned patterns.</li>
 <li>Statistical Analysis: Apply statistical methods to compute distance metrics, compare means and variances, or perform hypothesis testing. Techniques like t-tests or chi-square tests can quantify the similarity or 
 dissimilarity between token lists and assess statistical significance.</li>
 </ol>
 It's important to note that the specific approach depends on the nature of the published holdings data and the available information for comparison. Combining multiple methods and cross-referencing results enhances confidence 
and robustness. 
 </Typography> 
 <Typography variant="h5">Idea in Practice</Typography> 
 <Typography>Let's explore how to fingerprint a specific wallet: <Link href="https://solana.fm/address/HFWv1riXSRJ3nVnnLZ9xi1K4r3zppRvcfVuiAGqAA8Y6?cluster=mainnet-qn1">HFWv1...AA8Y6</Link><br /><br /> 

First, we assume that this address belongs to an exchange. Clues like evidence of a deposit address forwarding scheme, transfer sizes and frequencies, and specific destinations help identify exchanges. 
<ol>
<li>Deposit addresses: Inbound addresses primarily serve as forwarding addresses. Coins may accumulate at the deposit address, but they are eventually swept into the main wallet.</li>
<li>Wallet statistics: The wallet has approximately 90k signatures, with 63k being basic Sol transfers, indicating a small exchange with a significant number of retail users. While some large transfers occur, the median transfer size is just 5 SOL.</li>
<li>Outbound transfers: Many transfers go to verifiable Rollbit addresses (addresses starting with RB...), indicating retail user activity. This pattern is similar to users of platforms like Robinhood.</li>
</ol>
Our greatest clue about address HFWv1...AA8Y6 actually came from more direct means by an ambitious sleth, <Link href="https://twitter.com/__Trap">@__Trap</Link>. They bravely reached out to SNS names that interacted with the wallet, and received a reply connecting the wallet to 
Gemini. <br/><br/>
With this information, we search for more substantiating evidence. So let's examine the SPL "token fingerprint" of the wallet to confirm if it indeed belongs to Gemini Exchange. A positive match would show strong overlap in the coins supported by the exchange and the contents of the wallet, while a weak or negative match would be exhibited by larger market cap SPL tokens that exist either in the wallet or the exchange, but not both. A list of coins supported by Gemini can be found here: <Link href="https://www.gemini.com/prices">Gemini Supported Tokens</Link><br/><br/> 
For brevity, here is a subset of Gemini's supported tokens available on the Solana blockchain as SPL tokens, along with the token accounts present in the wallet HFWv1...AA8Y6:<br/><br/>
<div 
 style={{ 
 display: 'flex', 
 alignItems: 'center' 
 }} 
 > 
<img src={fingerprint} width={1000} align='center' alt="Token Fingerprint Example" />
</div><br/><br/>


The overlap between Gemini's supported tokens and the tokens present in the wallet is undeniable. Eight out of nine readily identifiable SPL tokens are listed on Gemini's markets. 

However, there is an interesting observation. This wallet does not contain any stablecoins, which is uncharacteristic of an exchange. Surprisingly, as of this summer, at least USDC-SPL is not supported by Gemini, as mentioned in this <Link href="https://x.com/azakharov/status/1681394288255733760?s=20">Twitter post</Link>. For an exchange, the absence of stablecoins is itself an identifiable feature. 

The absence of significant stablecoins like USDC and USDT, combined with the 1:1 match between SPL token accounts and the SPL tokens from Gemini's published token list, strongly suggests that the Gemini label is 
a viable candidate for this wallet. </Typography> 
 <Typography variant="h5">Conclusion</Typography> 
 <Typography>This article introduces the concept of using SPL token accounts for identifying large entities such as exchanges through <em>token account fingerprinting</em>. It briefly outlines various mathematical techniques for establishing 
relationships between wallet contents and off-chain data (although not explored in detail). Lastly, the article applies this technique to attempt to identify a specific wallet owner. While this exploration is superficial, token account 
fingerprinting shows promise and could be a subject of future research.</Typography> 

<Card variant="outlined"> 
 <CardContent> 
 <Typography variant="h6" component="div"> 
 More Info:
 </Typography> 
 <Typography variant="body2">
 Twitter Post: <Link href="https://x.com/4shpool/status/1706705684296081649">https://x.com/4shpool/status/1706705684296081649</Link>
 </Typography> 
 </CardContent> 
 </Card> 
 </Stack> 
 </Paper> 
 ); 
} 
 
export default TokenFingerprinting;