{Economics, Technology}

# Bitcoins, from Rebel Currency to Institutional Asset

## Bitcoin basics
Bitcoin is more than code running on computers. It is a decentralised digital network that lets people send value across the internet without asking permission from banks or governments. At its heart is the blockchain, a public ledger maintained by thousands of independent nodes. Every transaction is recorded in this ledger, and because the records are cryptographically linked, they cannot be faked or quietly rewritten. For the first time, money could exist as pure information, verified not by institutions but by mathematics.

A block is essentially a page in this ledger. Once miners verify its contents, it becomes part of a chain of previous blocks, forming a tamper resistant history. Mining serves two roles: it issues new bitcoins and secures the network through (proof of work system)[a cryptographic mechanism where participants must solve a computationally difficult puzzle to perform an action, proving they expended real-world computational effort.](#). This mechanism forces participants to exhaust real resources to add blocks, making attacks costly and verification cheap.

Wallets store private keys, the cryptographic credentials that grant control over bitcoins. 

Exchanges bridge Bitcoin with traditional money, but in doing so they reintroduce the very layer of trust that Bitcoin was designed to eliminate. Users who leave their coins on exchanges are trusting a centralised company not to lose funds to hacks, not to misuse deposits, and to honour withdrawals. In other words, instead of relying on mathematics and decentralised consensus, they are once again relying on human institutions; precisely what Bitcoin sought to remove.

## Cryptography developments and early cryptocurrency attempts

The roots of Bitcoin stretch back to David Chaum in the early 1980s. Chaum worried that as society digitised, financial transactions would become a near perfect tool of surveillance as it could provide states and corporations the ability to trace every purchase and payment. His invention of (blind signatures)[A blind signature is a cryptographic technique that allows someone to get a message signed by another party without revealing the content of the message itself to the signer akin to how you may put a document inside an envelope so the signer can stamp it without seeing what’s inside.](#) in 1983 was a direct response: a cryptographic method that allowed messages or transactions to be validated without revealing their contents. In practice, this meant that money could be both verifiable and private. Building on this idea, Chaum founded DigiCash in the late 1980s, which issued electronic coins known as eCash. These coins could be withdrawn from a bank and spent anonymously. DigiCash was both ambitious and philosophically consistent with Chaum's vision of a form of money that preserved privacy; though it never reached mass adoption, it planted an important seed as we will see.


> Knowledge by a third party of the payee, amount, and time of payment for every transaction made by an individual can reveal a great deal about the individual
> <cite>David Chaum

In 1992, Cynthia Dwork and Moni Naor [proposed a new idea called proof of work](https://www.wisdom.weizmann.ac.il/~naor/PAPERS/pvp.pdf) as a way to combat email spam and denial of service attacks. The logic was simple: if each email required the sender to perform a small but measurable amount of computation, spammers (who bulk send maliciously authored messages to many) would be forced to bear real costs, making bulk abuse uneconomical. The mechanism purely functioned as a way to make spamming expensive while keeping normal emailing cheap.

Adam Back’s 1997 [Hashcash](http://www.hashcash.org/hashcash.pdf) was the first serious attempt to make Dwork and Naor’s theoretical proof of work scheme operational. Back’s aim was purely pragmatic and consistent with Dwork and Naror’s intentions to stop the explosion of email spam by attaching a small computational cost to each outgoing message. His system required the sender to generate a header with a hash that met a specific difficulty requirement. In practice this meant running the hash function over and over until the output happened to fall below a target, much like buying lottery tickets until one finally wins. For ordinary users the cost was negligible, but for spammers trying to send millions of emails, the energy would sum up quickly. Hashcash never took off in mainstream email infrastructure, but it crystallised the proof of work idea into working code.

Several years later, in 2004, Hal Finney extended this principle further with RPoW (Reusable Proof of Work). It was not an email protocol like Hashcash but rather a clear attempt at building a prototype digital currency. Whereas Hashcash tokens were single use, Finney wanted a way to make them act more like money that could be passed around. His system took a Hashcash token and swapped it for a new digital token signed with RSA, which could then be sent from one person to another multiple times. To make sure nobody could fake these tokens, Finney ran RPoW on a special tamper resistant IBM 4758 computer that could prove to anyone it was running the correct software. This meant even Finney himself could not secretly alter the system. RPoW turned short lived proof of work stamps into reusable digital coins. The catch was that everyone still had to trust Finney’s server, leaving a central point of control. Bitcoin would later remove that need entirely.

Then came the period of near misses. Wei Dai’s b-money imagined a community maintained ledger and digital signatures for validation. Nick Szabo’s Bit Gold was even closer.
Szabo designed a system to replicate gold’s properties. Users would solve cryptographic puzzles to mint digital assets, each solution timestamped and linked to the next, forming a chain. A (Byzantine fault tolerant)[A system is Byzantine fault tolerant if it can reach agreement or consensus even when some of the users lie, act arbitrarily, crash, go silent, send contradictory messages or are outright trying to sabotage the system.](#) registry ensured consensus without central control. 
Bit Gold was actually the clearest precursor to blockchain combining proof-of-work, (decentralisation)[the process or design principle by which decision-making power, control, or data storage is distributed across multiple entities, rather than concentrated in a single central authority.](#), and scarcity into a cohesive framework. Szabo’s work on the (double spending problem)[The double spending problem is the risk that a digital currency can be spent more than once; that is, copied and reused like a file. Unlike physical cash, which can’t be in two places at once, digital files can be duplicated easily. Without some kind of protection, someone could send the same digital coins to two people and effectively “counterfeit” money.](#) and trust minimisation were influential on Bitcoins subsequent design.

By the end of the 1990s, most components of decentralised money had emerged. What was missing was integration. No system had yet merged incentives, difficulty adjustment, and security into a fully working protocol. Bitcoin’s breakthrough was in turning ideas from Chaum, Dai, Szabo, and others into a functioning, digital currency, that didn’t need to be backed by trusted third parties like banks or financial institutions.

## Born in a banking breakdown

On October 31, 2008, amidst the chaos of the global financial crisis, an anonymous figure known only as Satoshi Nakamoto published a nine-page paper titled “[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)”. The seemingly modest document would prove to be an incredibly important publication in the history of money and technology. 

What began as a response to the fundamental flaws exposed in the traditional banking system during the 2008 financial meltdown would evolve into a $2.4 trillion digital asset that challenges the many of the core principles of fiat.

The timing of Bitcoin’s emergence was no coincidence. As governments around the world scrambled to bail out failing banks with taxpayer money, Nakamoto’s vision of a decentralised, peer-to-peer electronic cash system offered an attractive alternative; a monetary system that operated without the need for trusted intermediaries, central authorities, or government oversight.

The Bitcoin paper addressed a fundamental problem that had plagued digital currency attempts for decades: the double spending problem.

Nakamoto’s solution combined several existing cryptographic techniques in a novel way, creating a system where transactions could be verified and recorded without requiring a central authority. The paper proposed using a proof-of-work consensus mechanism (building directly on Adam Back’s Hashcash system) to create an (immutable)[unchangeable or incapable of being altered, even over time.](#) ledger of transactions maintained by a distributed network of computers.

The paper’s introduction captured the essence of the problem “Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments”. 
Nakamoto argued that this reliance on intermediaries increased transaction costs and created systemic vulnerabilities. The proposed solution was a purely peer to peer version of electronic cash that would allow online payments to be sent directly from one party to another without going through intermediaries or institutions. 

## Early Bitcoin usage
Bitcoin’s emergence as a functioning monetary system began with the mining of the Genesis Block on January 3, 2009, by Satoshi Nakamoto. Embedded within this block was a striking message: “The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.” This was both a timestamp and a pointed critique of the failing fiat banking system. The Genesis Block contained 50 unspendable bitcoins and had no predecessor, establishing the foundation for a truly decentralised ledger.

Nine days later, Bitcoin demonstrated its operational viability when Nakamoto sent 10 BTC to the earlier mentioned cryptographer, Hal Finney, marking the first recorded transaction.
Over the following year, Bitcoin circulated with no official market price. In October 2009, the New Liberty Standard assigned a rough exchange rate of 1,309 BTC per USD, reflecting electricity costs for mining, and shortly after, a PayPal transaction valued Bitcoin at $0.00099 per coin.

The first real world use occurred in May 2010, when Laszlo Hanyecz purchased two pizzas for 10,000 BTC, now commemorated as Bitcoin Pizza Day. This transaction confirmed Bitcoin’s potential as a medium of exchange, even if its broader economic value remained speculative. As the network gained traction, the first exchanges began to form, providing a venue for buyers and sellers to convert Bitcoin into fiat currency.

Bitcoin faced its first serious challenge in August 2010 when a protocol vulnerability was exploited to create 184 billion bitcoins, far exceeding the intended supply. The community responded swiftly, correcting the error and implementing a hard fork to preserve the blockchain’s integrity. While the incident exposed Bitcoin’s early vulnerabilities it also highlighted the resilience of its decentralized governance.

The first major exchange, Mt. Gox, originally designed for trading Magic: The Gathering cards, was repurposed in 2010 by Jed McCaleb to handle Bitcoin trading. Under Mark Karpeles’ leadership from 2011, it processed over 70 percent of all Bitcoin transactions, becoming the central hub of the early Bitcoin economy.

Bitcoin’s initial price surge came in 2013, fueled by factors such as the European debt crisis, which prompted individuals to seek alternatives to traditional banks. The currency rose from around $13 in January to over $1,000 by November, drawing mainstream attention. The rise was brief: in December 2013, China prohibited financial institutions from using Bitcoin, and in February 2014, Mt. Gox filed for bankruptcy after losing roughly 850,000 bitcoins to theft, worth $450 million at the time.

Despite these setbacks, the technology underpinning Bitcoin advanced. The community wrestled with scaling, debating ways to increase 
(transaction throughput)[Transaction throughput refers to the number of transactions a system can process within a given time frame; usually measured as transactions per second (TPS). In the context of blockchains, databases, or payment systems, throughput is a key performance metric that tells you how fast and scalable the system is under real-world conditions.](#), the number of transactions a system can process per second. These debates led to the 2017 activation of (Segregated Witness)[ a major Bitcoin protocol upgrade that was activated in August 2017. Its primary goal was to solve transaction malleability and increase Bitcoin’s transaction throughput, without increasing the block size directly. ](#)) (SegWit), which solved transaction malleability and improved capacity without enlarging block sizes. SegWit also paved the way for the Lightning Network, a Layer 2 protocol built on top of Bitcoin (and other blockchains) that enables fast, cheap, and scalable transactions by moving them off chain, while still preserving the security and decentralisation of the underlying blockchain.

## Bitcoins maturation and institutional adoption

Between 2015 and 2017, Bitcoin shifted from being a hobbyist experiment to a global asset. The speculative mania of 2017 pushed it near $20,000, but when the bubble burst, what remained was infrastructure: better exchanges, stronger custody solutions, and a developer ecosystem.

With time, Bitcoins narrative evolved. By the 2020s, Bitcoin was less about buying coffee and more about storing wealth. “Digital gold” became its shorthand identity. Its fixed supply of 21 million coins, enforced by code rather than central banks, made it attractive as a hedge in a world of money printing. Each halving event reinforced this scarcity.

The COVID-19 pandemic was a turning point. Governments flooded economies with liquidity, and inflation fears made Bitcoin suddenly respectable to institutions. MicroStrategy’s decision in 2020 to move its corporate treasury into Bitcoin marked a pretty big shift in how it was percieved; Tesla, Square, and others soon followed.

By 2024, the approval of spot Bitcoin ETFs in the United States gave pension funds and retail investors alike a simple way in. BlackRock and Fidelity treated Bitcoin as a legitimate asset, not a curiosity. By 2025, institutional investors had placed over $68 billion into ETFs.

Bitcoin had grown into a $2.4 trillion market. It was no longer just a cypherpunk plaything but a fixture of the global financial system; despite being created somewhat as a rebellion against centralised finance,  its survival increasingly depended on the very institutions it once sought to bypass.

## The electronic tulip

> Bitcoin turned out not to be a currency. It is an electronic tulip perhaps; but not a currency.
> <cite>Nassim Nicholas Taleb

Taleb’s polemic assessment pinpoints Bitcoins fundamental flaw with uncompromising precision. Despite the hype and fanfare, Bitcoin has not delivered on the primary ambition articulated in its white paper: to serve as a dependable medium for everyday transactions and commerce.

Rent is not set in Bitcoin, wages are not paid in Bitcoin, grocery receipts do not show BTC because everyday transactions are still conducted in traditional currencies. Volatility destroys Bitcoin’s credibility as money. A currency cannot swing ten percent in a day and still be called a currency. This instability is not a passing stage of adolescence; it is structural, baked into its fixed supply system that reacts violently to speculative flows. Bitcoin’s scarcity makes it a playground for traders rather than a foundation for commerce.

Its energy footprint compounds the matter. While proof of work is ingenious, its also indefensible in scale. At its peak, Bitcoin consumed more electricity than entire countries, to secure a network that clears fewer transactions than PayPal on an bad afternoon. To call this “sound money” while burning terawatt hours of energy is hard to square with any conception of efficiency.

And then there is the irony: Bitcoin’s maturation has made it more (not less) dependent on the very financial institutions it set out to sidestep. ETFs, custodians, exchanges, BlackRock and Fidelity now sit at the center of Bitcoin’s survival. The rhetoric of rebellion has collapsed into the reality of assimilation. The supposed weapon against centralised finance has become just another instrument within it.

Taleb’s tulip comparison is harsh, but I’d argue it largely captures the truth. Bitcoin has not evolved into money but has rather settled into something else: a speculative asset class, useful as a hedge for some, a gamble for others, but stripped of its founding dream. It is not electronic cash. It is electronic tulip, priced not by its utility but by scarcity and fragility.
