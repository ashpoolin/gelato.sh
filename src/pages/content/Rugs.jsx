import { Card, CardContent, CardMedia, Typography, Link, Paper, Stack } from "@mui/material"; 
import feeSwitching from "../../assets/fee_switching.jpg";

function Rugs() { 
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
 <Typography variant="h4">Stake Commission Rugs</Typography> 
 <Typography variant="h5">Introduction</Typography> 
 <Typography> 
 This article discusses validators that are currently abusing stakers by changing their commission structure to take <em>extraordinary</em> staking reward fees. Solana is a delegated proof-of-stake network, which generally means that the user trusts a validator to vote on consensus on their behalf, and in exchange they are entitled to their fee, which is fair and normal. This article addresses the issue where a few validators take all of the staking yield, or significantly more than their fair share. We call this "commission rugging," which may entail sneaky tricks like changing the commission rate to 100% for a few epochs, or changing the commission rate to 100% at the end of an epoch, and then switching it back to a realistic rate to avoid detection. <br /><br />

There are over 200 "private" (100% commission) validators on Solana, so analysis starts with the most egregious commission ruggers. There are likely others, which we are working on production-grade methods to identify them. The article discusses a list, now available on <Link href="https://gelato.sh/stake">gelato.sh/stake ["shame" tab]</Link> that shows validators that participate in the Solana Foundation stake program and therefore should not be charging greater than 10%. Additionally, we identify that the proportion of the validator's total stake contributed by the Solana Foundation is typically very high, where a higher number indicates a greater likelihood of commission rugging (e.g. no "skin in the game").
 </Typography> 
 <Typography variant="h5">What is Commission Rugging? </Typography> 
 <Typography><em>Commission rugging</em> is the act of hiding or changing a validator's true commission structure from the stake delegator, so as to capture extraordinary fees. Fees which the validator is not normally entitled to, or that the user is otherwise unaware of. It's theft, and it's fraud.</Typography> 
 <Typography variant="h5">Making the Discovery</Typography> 
 <Typography>We were originally looking into validator profitability, and the incentives that large stake owners like the Solana Foundation stake program, exchanges, and even Alameda produced for validators. Some validators naturally bubbled up as more profitable than others. Those were, of course, validators that charged very high commission (100%; in many cases, "private" validators). Then we made another connection--some of these validators weren't actually behaving like, and shouldn't be labeled as private. <b>They were receiving delegations from the Solana Foundation stake program, and charging 100% commission.</b> The norm seems to be 10% maximum commission for program participants, but these validators charged 100%, or 900% more. In addition to employing a "highly profitable" strategy, these validators also stood out for another reason: the Foundation stake is an extremely high percentage of the total delegated stake, ranging from 67%-100%. <b>These validators have "no skin in the game"--they're parasites.</b><br/><br/>
 
 We qualify commission ruggers as validators that have received delegation from the Solana Foundation stake program's stake authority: <Link href="https://solscan.io/account/mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5">mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5</Link>. We obtain the list of validators from the stake authority's stake accounts, first obtained using the CLI tool and code similar to this: `solana stakes --output json | in2csv --format json | grep mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5`. 
 </Typography> 
 <Typography variant="h5">A Challenge for the Foundation</Typography> 
 <Typography>The offending validators are very sneaky. It appears they move around, possibly change vote ID keys, and often engage in <em>commission switching</em>: changing commission to 100% for a finite duration to capture the epoch rewards, then switch it back to 10% to a) try to attract more stake, and b) avoid detection. An example of this follows:
 <div 
 style={{ 
 display: 'flex', 
 alignItems: 'center' 
 }} 
 > 
<img src={feeSwitching} width={1000} align='center' alt="Fee Switching Example" />
</div><br/><br/>
 
 Users will likely defect if they see their yields being stolen. The Foundation stakes to over 1500 validators, and while they employ several systems to confirm only legitimate validators receive stake from the pool, it's just a large technical job to ensure adherence to the rules. The stake program is also a juicy target, as it controls a massive stake pile (70-80M SOL), and is much easier to get than doing real work to establish market trust and develop a brand. The program provides an invaluable subsidy for keep validator count and geographic distribution high. But the unfortunate fact is that not everyone is honest if they think nobody is looking.
 </Typography> 
 <Typography variant="h5">Estimating the Cost</Typography> 
 <Typography>The Gelato team identified a total of 22 commission rugs in the Foundation stake program, however, only 11 of them had meaningful delegations. The average stake per participant is about 45,000 SOL, so 11 x 45,000 at today's prices $30-35/SOL, with a 7%/yr staking reward, and we're talking 34,650 SOL/yr worth approximately $1-1.2M/yr. The losses are  if left unchecked.
 
 There's a direct financial cost of the theft, as shown above. The Foundation is responsible for stewardship of the chain, ensuring its long-term success, and providing grants to the community to spur development. 
  
 In the face of frauds like these, the job of vetting grant proposals and ecosystem participants becomes more difficult, and may provide a chilling effect on the funding of good projects.
  
 The fraud hurts trust within the community. The Foundation may be more skeptical of legitimate projects, and users may be wary of staking to lesser-known validators.</Typography> 
 <Typography variant="h5">Existing Tools</Typography> 
 <Typography>We relied heavily on Brian Long's (@brianlong) validators.app page to confirm info about the validators, their performance, and even their fee history. There are already warning labels on suspect validators, and the fee change log clearly shows which validators are engaged in fee switching. With the validators.app tool, we were able to confidently say that the validators we identified were not in compliance. Further, one validator even cited financial hardship as a reason that they "had to do it"; also an admission of the theft. All visible from validators.app! Kudos to Brian and his team's stewardship of the staking economy.</Typography> 
 <Typography variant="h5">New Heuristics</Typography> 
 <Typography>The watchwords of crypto are "don't trust; verify." It's good advice, but trust actually is important, though, and so we must design systems that compel honesty. Gelato has taken steps to do just that, by introducing the validator "wall of shame." The system is automated, seeks aberrant or non-compliant validator behavior, puts it on the screen to easily see. It is meant to evoke the feeling that is its namesake. Sorry, theft it theft, and crooks *should* feel bad about it. 

The gelato.sh/stake [shame] page currently only follows the Foundation stake program, since the heuristics for detecting fraud are much simpler: if validator is in foundation stake program AND commission > 10% => RUG. 

The challenge is separating private validators from commission ruggers, since they will both be charging 100% commission. The 100% commission of course is a deterrent for outside individuals to stake with you; they won't benefit, hence, "private." Conversely, a rug will likely try to mask the fact that they are charging an exorbitant commission in order to attract new victims. This requires them to advertise a commission lower than 100%, competitive with standard market fees (0%-10%, typical). To do this, they do fee switching, which manifests as one or more changes in fee structure to >10% (100% is most common). The only way to do that is using the Solana `vote` program's `changeCommission` instruction, and with Helius' exciting new websockets feature, we have a clean means of filtering out noisy `vote` transactions, and listening to that very instruction. While legitimate validators can and do change their fee structure to ensure to compete and ensure their financial sustainability, frequent fee-switching behavior is highly suspicious, and can easily be used to discern legitimate actors from those that are not. The new heuristic will be added in coming days-weeks. We want to send a very clear message to fee rugs everywhere: this activity is not safe for you. Our systems and the ecosystem is watching, and poor behavior in the validator community will not be tolerated. You will be caught.</Typography> 
 <Typography variant="h5">Conclusion</Typography> 
 <Typography>We introduced the concepts of validation commission rugging, fee-switching as a way to charge extraordinary fees to stake delegators. We enumerated the impetus (greed), and the means by which this scheme is accomplished. We showed how simple analysis and heuristics were used to identify existing non-compliant validators, which ultimately saved the Solana Foundation a large amount of money. We also explained two new heuristics that will be used to power an automated system that filters these predatory validators, and displays their identity pubkey and vote pubkey to serve as a warning to the the community and a deterrent to staking with them.</Typography> 
 <Typography variant="h5">Questions / Concerns</Typography> 
 <Typography>This system is new, and is not guaranteed to be free from bugs. If your validator has been picked up by the system, and is provably legitimate, please contact us and we will whitelist the validator, label it as private, and otherwise issue communication clearing the validator's name.</Typography> 

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
 Twitter: <Link href="https://twitter.com/solanobahn">@solanobahn</Link>
 </Typography> 
 </CardContent> 
 </Card> 
 </Stack> 
 </Paper> 
 ); 
} 
 
export default Rugs;