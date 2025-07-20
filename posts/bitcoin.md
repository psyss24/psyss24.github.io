{Economics, Technology}

# The global adoption of Bitcoin

## Bitcoin basics

At its core, Bitcoin is a decentralised digital network — a way for people to send value over the internet without needing a bank, a government, or anyone’s permission. It runs on open-source code and is powered by thousands of independent computers (or “nodes”) around the world that collectively maintain a shared ledger called the blockchain. Think of it as a public database that records every transaction ever made, in a way that can’t be faked, forged, or quietly edited.

A block in Bitcoin is like a page in the ledger of the Bitcoin network. It contains a batch of valid transactions that were made over a certain period of time, plus some important metadata. Once a block is verified by miners, it’s added to the chain of previous blocks. A chain is what you get when you cryptographically link each block to the one before it. So a blockchain is just a long, tamper-resistant history of who sent what to whom, and when.

Mining is how new bitcoins are created and how transactions are verified, using something called (proof-of-work system)[a cryptographic mechanism where participants must solve a computationally difficult puzzle to perform an action, proving they expended real-world computational effort.](#).

Wallets store your bitcoins (really, your private keys), while exchanges let you trade Bitcoin for traditional money.

## Cryptography developments and early cryptocurrency attempts

The evolution of digital currency began with David Chaum, a pioneering cryptographer who, in the early 1980s, laid the groundwork for anonymous electronic cash. His 1982 dissertation proposed the first (blockchain protocol)[ a set of rules and standards that govern how data is structured, validated, and transmitted across a blockchain network. It dictates how nodes (participants) interact, how consensus is reached, how transactions are verified, and how blocks are added to the chain. ](#). 

In 1983, Chaum introduced (blind signatures)[A blind signature is a cryptographic technique that allows someone to get a message signed by another party without revealing the content of the message itself to the signer akin to how you may put a document inside an envelope so the signer can stamp it without seeing what’s inside.](#) to enable private, untraceable payments, anticipating a future where surveillance of financial behaviour would be pervasive. His work planted the seeds for privacy-preserving money long before the internet mainstreamed digital finance.

> Knowledge by a third party of the payee, amount, and time of payment for every transaction made by an individual can reveal a great deal about the individual
> <cite>David Chaum

In 1992, Cynthia Dwork and Moni Naor [proposed a new idea to combat spam](https://www.wisdom.weizmann.ac.il/~naor/PAPERS/pvp.pdf), requiring users to solve moderately hard computational puzzles before accessing digital resources. This early form of a proof-of-work system imposed a cost on spam without affecting normal users — a foundational concept for deterring abuse in decentralised systems.

Adam Back’s 1997 [Hashcash](http://www.hashcash.org/hashcash.pdf) implemented this concept practically. To send an email, users had to compute a hash with a specific number of leading zeros — computationally expensive to generate but easy to verify. Though designed to fight spam, Hashcash directly inspired Bitcoin’s mining system.

In 1998, Wei Dai proposed b-money, the first decentralised digital currency concept. It envisioned a system without central authority, where all participants collectively maintained a public ledger. Dai proposed using proof-of-work to generate new currency and (digital signatures)[a cryptographic tool that lets you prove authenticity, integrity, and non-repudiation of a digital message or document. It’s the digital equivalent of a handwritten signature — but far more secure and verifiable.](#) to verify transactions — core elements later adopted in Bitcoin. Satoshi Nakamoto cited b-money in the Bitcoin paper and contacted Dai during its development.

That same year, Nick Szabo introduced Bit Gold, a system designed to replicate gold’s properties. Users would solve cryptographic puzzles to mint digital assets, each solution timestamped and linked to the next, forming a tamper-resistant chain. A
(Byzantine fault-tolerant)[A system is Byzantine fault-tolerant if it can reach agreement or consensus even when some of the users lie, act arbitrarily -- crash, go silent, or send contradictory messages -- or are outright trying to sabotage the system.](#) registry ensured consensus without central control. 
Bit Gold was actually the clearest precursor to blockchain combining proof-of-work, (decentralisation)[the process or design principle by which decision-making power, control, or data storage is distributed across multiple entities, rather than concentrated in a single central authority.](#), and scarcity into a cohesive framework. Szabo’s work on the (double-spending problem)[The double spending problem is the risk that a digital currency can be spent more than once — that is, copied and reused like a file. Unlike physical cash, which can’t be in two places at once, digital files can be duplicated easily. Without some kind of protection, someone could send the same digital coins to two people and effectively “counterfeit” money.](#) and trust minimisation were influential on Bitcoins subsequent design.

By the end of the 1990s, most components of decentralised money had emerged. What was missing was integration. No system had yet merged incentives, difficulty adjustment, and security into a fully working protocol. Bitcoin’s breakthrough was in  turning ideas from Chaum, Dai, Szabo, and others into a functioning, digital currency, that didn’t need to be backed by trusted third parties like banks or financial institutions.

## Born in a banking breakdown

On October 31, 2008, amidst the chaos of the global financial crisis, an anonymous figure known only as Satoshi Nakamoto published a nine-page paper titled “[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)”. The seemingly modest document would prove to be an incredibly important publication in the history of money and technology. 

What began as a response to the fundamental flaws exposed in the traditional banking system during the 2008 financial meltdown would evolve into a $2.4 trillion digital asset that challenges the many of the core principles of fiat.

The timing of Bitcoin’s emergence was no coincidence. As governments around the world scrambled to bail out failing banks with taxpayer money, Nakamoto’s vision of a decentralised, peer-to-peer electronic cash system offered an attractive alternative — a monetary system that operated without the need for trusted intermediaries, central authorities, or government oversight.

The Bitcoin paper addressed a fundamental problem that had plagued digital currency attempts for decades: the [double-spending problem](Unlike%20physical%20cash,%20digital%20data%20can%20be%20copied%20easily.%20If%20you%20send%20someone%20a%20file%20(like%20a%20song%20or%20PDF),%20you%20still%20have%20a%20copy.%20Digital%20money,%20without%20protection,%20works%20the%20same%20way;%20unless%20carefully%20controlled,%20you%20could%20send%20the%20same%20unit%20to%20multiple%20recipients%20and%20fraudulently%20multiply%20your%20funds.). 

Nakamoto’s solution combined several existing cryptographic techniques in a novel way, creating a system where transactions could be verified and recorded without requiring a central authority. The paper proposed using a proof-of-work consensus mechanism (building directly on Adam Back’s Hashcash system) to create an (immutable)[unchangeable or incapable of being altered, even over time.](#) ledger of transactions maintained by a distributed network of computers.

The paper’s introduction captured the essence of the problem “Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments”. 
Nakamoto argued that this reliance on intermediaries increased transaction costs, made small casual transactions impractical, and created systemic vulnerabilities. The proposed solution was a purely peer-to-peer version of electronic cash that would allow online payments to be sent directly from one party to another without going through intermediaries or institutions. 

## Early Bitcoin usage

Bitcoin’s story as a credible monetary system begins with the mining of the Genesis Block on January 3, 2009, by Satoshi Nakamoto. Embedded within this first block was a now-famous message: “The Times 03/Jan/2009 Chancellor on brink of second bailout for banks” — a reference the an article by The Times, and a jab at the failing fiat system the world relied on. The Genesis Block, containing 50 unspendable bitcoins, had no predecessor, laying the foundation for a radically decentralised ledger.

Nine days later, Bitcoin proved itself functional when Nakamoto sent 10 BTC to cryptographer Hal Finney, marking the first transaction. Finney had worked on RPOW (Reusable Proof of Work), a precursor to Bitcoin’s design. Over the next year, Bitcoin circulated with no official market value until October 2009, when the New Liberty Standard pegged 1 USD at 1,309 BTC based on electricity costs of mining new bitcoins. Not long after, Bitcoin was traded for $5.02 via PayPal, valuing each coin at $0.00099.

Bitcoin’s first real-world use came in May 2010, when Laszlo Hanyecz famously spent 10,000 BTC (today worth £880 billion) on two pizzas — now commemorated as Bitcoin Pizza Day. This proved its viability as a medium of exchange, even if its value was still abstract. As activity grew, exchanges emerged. 

The early Bitcoin ecosystem faced its first major test in August 2010 when a critical vulnerability in the protocol was discovered and exploited. A transaction created 184 billion bitcoins, far exceeding the intended supply limit. However, the community quickly responded, fixing the bug and implementing a hard fork to restore the blockchain’s integrity. The incident demonstrated both Bitcoin’s vulnerability and its resilience.

As Bitcoin gained traction, the first exchanges emerged. Mt. Gox (originally created in 2006 for trading Magic: The Gathering cards) was repurposed by Jed McCaleb in 2010 to become Bitcoin’s first major exchange. Under Mark Karpeles leadership from 2011, Mt. Gox grew to handle over 70% of all Bitcoin transactions globally, becoming the de facto center of the Bitcoin economy.

Bitcoin’s first major price surge occurred in 2013, driven by a combination of factors including the European debt crisis, particularly in Cyprus and Greece, which led people to seek alternatives to traditional banking. The currency’s price rose from around $13 at the beginning of 2013 to over $1,000 by November, capturing mainstream media attention for the first time.

However, the meteoric rise was short-lived. In December 2013, the Chinese government prohibited financial institutions from using Bitcoin, sending the currency into a tailspin. The situation worsened dramatically in February 2014 when Mt. Gox suspended trading and filed for bankruptcy, revealing that approximately 850,000 bitcoins (worth $450 million at the time) had been stolen over several years.

Despite the setbacks, Bitcoin’s underlying technology continued to evolve. The community grappled with scaling challenges, leading to heated debates about how to increase (transaction throughput)[Transaction throughput refers to the number of transactions a system can process within a given time frame — usually measured as transactions per second (TPS). In the context of blockchains, databases, or payment systems, throughput is a key performance metric that tells you how fast and scalable the system is under real-world conditions.](#). This culminated in the 2017 implementation of (Segregated Witness (SegWit))[ a major Bitcoin protocol upgrade that was activated in August 2017. Its primary goal was to solve transaction malleability and increase Bitcoin’s transaction throughput, without increasing the block size directly. ](#), which laid the groundwork for the (Lightning Network)[a Layer 2 protocol built on top of Bitcoin (and other blockchains) that enables fast, cheap, and scalable transactions by moving them off-chain, while still preserving the security and decentralisation of the underlying blockchain.](#).

## Bitcoins maturation and institutional adoption

The period from 2015 to 2017 saw Bitcoin’s gradual rehabilitation. The price began recovering in 2016, driven in part by Chinese demand as the Yuan depreciated. The 2017 bull run was extraordinary, with Bitcoin’s price rising from under $1,000 at the start of the year to nearly $20,000 by December. This surge was fueled by retail investor enthusiasm, media coverage, and the emergence of Initial Coin Offerings (ICOs).
The 2017 bubble burst dramatically in early 2018, with Bitcoin losing over 80% of its value. However, the infrastructure built during this period, including more robust exchanges, custody solutions, and regulatory frameworks, provided a foundation for future growth.

The post-2017 period was characterised by infrastructure development and regulatory clarity. Major financial institutions began exploring blockchain technology, though many remained skeptical of Bitcoin itself. The European Central Bank and other central banks published research on digital currencies, while regulators worldwide worked to establish frameworks for cryptocurrency oversight.
During this period, Bitcoin’s narrative evolved from a speculative asset to a potential store of value. Proponents would describe it as “digital gold,” emphasising its scarcity (with a maximum supply of 21 million coins) and resistance to inflation. 
The halving events, programmed reductions in mining rewards that occur approximately every four years, reinforced the scarcity narrative.

The 2020s marked a fundamental shift in Bitcoin’s adoption as the COVID pandemic and subsequent monetary policy responses by central banks worldwide led to concerns about currency debasement and inflation. 

In this environment, Bitcoin’s fixed supply became increasingly attractive to institutional investors.
The transformation began in August 2020 when MicroStrategy announced it would adopt Bitcoin as its primary treasury reserve asset. The company initially invested $250 million in Bitcoin, viewing it as a hedge against currency debasement. 

The decision would spark a trend among corporations, with companies like Tesla, Square, and others adding Bitcoin to their balance sheets.
The institutional adoption accelerated dramatically in 2024 with the approval of spot Bitcoin ETFs by the U.S. Securities and Exchange Commission. These investment vehicles, led by BlackRock’s IBIT and others, made Bitcoin accessible to mainstream investors without the complexities of direct ownership. By 2025, institutional investors had poured $68 billion into Bitcoin ETFs, which represented a fundamental shift in how the asset is perceived and traded.

