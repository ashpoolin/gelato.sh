import { Card, CardContent, CardMedia, Typography, Link, Paper, Stack } from "@mui/material"; 

function Whalescale() { 
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
 <Typography variant="h4">Whalescale: Analyzing Wallet Prestige in Cryptocurrency Networks</Typography> 
 <Typography variant="h5">Abstract</Typography> 
 <Typography> 
 The WhaleScale algorithm, an adaptation of Google's famous PageRank algorithm, offers a novel approach for assessing the significance and importance of cryptocurrency wallets within a financial network. Unlike PageRank, which 
analyzes web pages and their links, WhaleScale focuses on wallets as nodes and measures the combined transfer amounts between them as edges. The algorithm determines the wallet's rank based on the frequency and value of 
cryptocurrency transfers. High-ranking wallets correspond to those with frequent and substantial transfers, providing valuable insights into the cryptocurrency market. The <Link href="https://github.com/ashpoolin/whalescale/blob/main/whalescale.pdf">WhaleScale white paper</Link> applies the WhaleScale algorithm to the TUSD 
ERC-20 token on the Ethereum blockchain, showcasing its efficacy in identifying critical nodes and analyzing transfer patterns. 
 </Typography> 
 <Typography variant="h5">Introduction</Typography> 
 <Typography>While existing "rich lists" offer some information about top holders, they often overlook crucial nodes and transaction paths. Many wallets, including forwarding accounts, play important roles in the flow of cryptocurrencies, 
but their significance is underestimated when solely considering wallet balances. To address this limitation, we introduce WhaleScale, a quantitative metric for evaluating the importance of nodes within a cryptocurrency 
network. Inspired by Google's PageRank algorithm, WhaleScale considers the total flow through a wallet and its connections to other nodes, resulting in a comprehensive ranking of network nodes. </Typography> 
 <Typography variant="h5">PageRank</Typography> 
 <Typography>The PageRank algorithm, developed by Google, assigns importance to web pages based on their network of links. It recognizes that a page is influential when linked by other important pages and propagates this importance through
the link structure. By considering the interconnectedness of web pages, PageRank offers more accurate and relevant search results than simple keyword matching.</Typography> 
 <Typography variant="h5">Prestige</Typography> 
 <Typography>Prestige, a concept drawn from network theory, determines the significance of a node within a network. Prestige emphasizes inbound traffic to determine rankings, making it suitable for financial networks. In the case of a 
cryptocurrency network, a node with high-value inbound transactions typically earns a higher prestige rank. PageRank is an example of an algorithm that estimates prestige, making it useful for identifying critical nodes in 
financial networks.</Typography> 
 <Typography variant="h5">The WhaleScale Algorithm</Typography> 
 <Typography>WhaleScale is an adaptation of PageRank specifically designed for analyzing cryptocurrency networks. By considering the transaction amounts between wallets, WhaleScale determines the significance of each wallet within the 
network. Wallets with a high number of transactions or substantial transfers receive higher ranks, reflecting their importance to the network. The algorithm propagates rankings based on transaction amounts and wallet 
connectivity. WhaleScale provides valuable insights into the cryptocurrency market, enabling users to track capital flows, forecast market trends, and identify potential cases of manipulation or fraud.</Typography> 
 <Typography variant="h5">Conclusion</Typography> 
 <Typography>The WhaleScale algorithm enables a deeper understanding of cryptocurrency networks and wallet dynamics. By evaluating the significance of individual wallets, WhaleScale aids in tracking capital movements and identifying key 
players within the network. This algorithm offers investors and analysts valuable insights for making informed decisions. The application of WhaleScale to the TUSD and other ERC-20 token networks on the Ethereum blockchain showcases its 
effectiveness in identifying critical nodes and analyzing transfer patterns. Overall, WhaleScale proves to be a powerful tool for studying and comprehending the complexities of the cryptocurrency market.</Typography> 

<Card variant="outlined"> 
 <CardContent> 
 <Typography variant="h6" component="div"> 
 More Info:
 </Typography> 
 <Typography variant="body2">
 Github Repo: <Link href="https://github.com/ashpoolin/whalescale/">https://github.com/ashpoolin/whalescale/</Link> 
 </Typography>
 <Typography variant="body2"> 
 White Paper: <Link href="https://github.com/ashpoolin/whalescale/blob/main/whalescale.pdf">https://github.com/ashpoolin/whalescale/blob/main/whalescale.pdf</Link> 
 </Typography>
 <Typography variant="body2">
 Email: <Link href="mailto:ashpoolin@protonmail.com">ashpoolin@protonmail.com</Link> 
 </Typography> 
 <Typography variant="body2">
 Twitter: <Link href="https://twitter.com/4shpool">@4shpool</Link>
 </Typography> 
 </CardContent> 
 </Card> 
 </Stack> 
 </Paper> 
 ); 
} 
 
export default Whalescale;