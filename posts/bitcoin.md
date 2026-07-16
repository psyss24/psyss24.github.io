{Economics, Technology}

# Bitcoin, from Rebel Currency to Institutional Asset

How did a currency designed to bypass traditional finance become embraced by it?

## Bitcoin basics
Bitcoin is often described as "digital money," though that is not really the interesting part. Your bank account is digital money. So is your PayPal balance. The unusual thing about Bitcoin is that nobody is supposed to be in charge of it. (Or, perhaps more accurately, everybody is).

Now a block is essentially a page in the ledger. Once miners verify its contents, it becomes part of a chain of previous blocks, forming a tamper resistant history. Mining serves two roles: it issues new bitcoins and secures the network through a (proof of work system)[a cryptographic mechanism where participants must solve a computationally difficult puzzle to perform an action, proving they expended real-world computational effort.](#). Each new block is cryptographically linked to the one before it, making the history extraordinarily difficult to alter. If a bank can rewrite its own database, Bitcoin can only rewrite history by convincing most of the network to agree, which is intentionally expensive (not impossible but prohibitively expensive, which in security is often close enough).

Owning Bitcoin is similarly unusual. A wallet does not actually store bitcoins; it stores the private keys that allow you to spend them. Lose those keys and your bitcoins are bascially inaccessible forever. Unfortuantely there is no helpful forgotten password button.

This brings us to one of Bitcoin's enduring ironies. In theory, you do not need to trust anyone. You can hold your own keys, verify the blockchain yourself, and transact without asking permission from a bank, payment processor or government. In practice, this sounds like quite a lot of work which is probably why most people therefore buy Bitcoin on exchanges and simply leave it there.

Which is funny (or maybe inevitable?). Bitcoin was invented to remove trusted intermediaries from finance and one of the first things most users do is hand their bitcoins to a trusted intermediary. Exchanges make Bitcoin vastly easier to use, but in doing so they quietly reintroduce the very institution Bitcoin was meant to eliminate. Instead of trusting mathematics, users trust a company not to lose their money, misuse customer deposits or disappear overnight. Sometimes that works. Sometimes it does not.

## Cryptography developments and early cryptocurrency attempts

Bitcoin did not emerge out of nowhere in 2008. By the time Satoshi Nakamoto published the Bitcoin white paper, most of its individual components had already existed for years, sometimes decades. The challenge was not inventing entirely new cryptography. It was figuring out how to combine existing ideas into a system that actually worked. As it turns out, that last step was the difficult one.

One of the earliest pieces came from David Chaum. In the early 1980s, Chaum became increasingly concerned that a digital society would make financial privacy almost impossible. Cash had always been anonymous by default. Digital payments, by contrast, threatened to become permanent records, allowing governments, banks and corporations to reconstruct an individual's entire economic life from transaction histories. As he put it:

> Knowledge by a third party of the payee, amount, and time of payment for every transaction made by an individual can reveal a great deal about the individual
> <cite>David Chaum

His answer was the invention of (blind signatures)[A blind signature is a cryptographic technique that allows someone to get a message signed by another party without revealing the content of the message itself to the signer akin to how you may put a document inside an envelope so the signer can stamp it without seeing what’s inside.](#). The idea was a bank could verify that a digital coin was legitimate without learning anything about the coin it was signing. (Imagine asking someone to stamp an envelope without letting them see the document inside.) The result was something that looked surprisingly like digital cash in that we now have money that could be verified without sacrificing privacy.

Chaum eventually turned the idea into a company called DigiCash, whose electronic currency, eCash, allowed users to withdraw and spend digital money anonymously. It was philosophically very close to Bitcoin in one respect: privacy was not a feature but the point. It differed in another, much more important respect. DigiCash still depended on a company, and ultimately on banks to operate. Users could hide transactions from outsiders, but they still needed someone to issue the money in the first place. Bitcoin would eventually remove that requirement too.


A decade later, Cynthia Dwork and Moni Naor were thinking about something entirely different: spam. In 1992, Cynthia Dwork and Moni Naor [proposed a new idea called proof of work](https://www.wisdom.weizmann.ac.il/~naor/PAPERS/pvp.pdf) to combat span by making sending millions of junk emails expensive. Sending one email costs almost nothing. Sending ten million emails also costs almost nothing. That asymmetry is what makes spam viable.
Their solution was to introduce a tiny computational cost before an email could be sent. For an ordinary user, the delay would barely be noticeable; nobody minds waiting a fraction of a second to send one email. For a spammer sending millions of messages, however, those tiny costs compound into an enormous bill.

Adam Back’s 1997 [Hashcash](http://www.hashcash.org/hashcash.pdf) was the first serious attempt to make Dwork and Naor’s theoretical proof of work scheme operational. Before sending an email, the sender had to repeatedly run a cryptographic hash function until it produced an output satisfying a particular condition. The only strategy was brute force keep trying until luck cooperated. Spammers, who needed to repeat the process millions of times, suddenly had a real economic problem.
Hashcash never became the universal anti spam system Back had hoped for. But it demonstrate that computation could be used as a scarce economic resource. Bitcoin would later borrow exactly that insight. Instead of making spam expensive, it would make attacking a monetary network expensive.

Several years later, in 2004, Hal Finney extended this principle further with RPoW (Reusable Proof of Work). It was not an email protocol like Hashcash but rather a clear attempt at building a prototype digital currency. Whereas Hashcash tokens were single use, Finney wanted a way to make them act more like money that could be passed around. His system took a Hashcash token and swapped it for a new digital token signed with RSA, which could then be sent from one person to another multiple times. To make sure nobody could fake these tokens, Finney ran RPoW on a special tamper resistant IBM 4758 computer that could prove to anyone it was running the correct software. This meant even Finney himself could not secretly alter the system. RPoW turned short lived proof of work stamps into reusable digital coins. The catch was that everyone still had to trust Finney’s server, leaving a central point of control. Bitcoin would later remove that need entirely.

Several others came remarkably close to Bitcoin without quite getting there.
In 2004, Hal Finney introduced Reusable Proof of Work (RPoW), an attempt to turn Hashcash's proof of work tokens into something that could circulate more like money. The idea worked, but only because users still trusted Finney's server to keep honest records. (Finney went to extraordinary lengths to make that trust as unnecessary as possible, but it never quite disappeared). Bitcoin's eventual breakthrough would be removing that final trusted intermediary altogether.
Around the same time, Wei Dai proposed b money, a purely theoretical system in which a distributed community, though not a bank, would maintain a shared ledger of ownership. Nick Szabo's Bit Gold went further still. It combined proof of work, digital scarcity and linked cryptographic records into something that looked strikingly like Bitcoin. (People sometimes describe Bit Gold as "Bitcoin before Bitcoin," which is not quite right, but it conveys the idea).

When Satoshi Nakamoto published the Bitcoin white paper in 2008, there was remarkably little that was entirely new; the novelty lay in the architecture. Bitcoin assembled ideas from Chaum, Dwork, Naor, Back, Finney, Dai, Szabo and others into a single system whose incentives reinforced one another. The individual components had existed for years. The machine had not.

## Born in a banking breakdown

By 2008, most of the ingredients for digital money already existed. Privacy had been explored. Proof of work had been explored. Distributed ledgers had been explored. What nobody had quite managed was combining them into a system that worked without somebody sitting in the middle.

On 31 October 2008, an anonymous author using the name Satoshi Nakamoto published a nine-page paper titled “[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)”. The paper is surprisingly modest. It does not promise to overthrow governments or replace the global financial system. It mostly reads like an engineering proposal.

Its opening sentence is revealing:

> Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments.
> <cite>Satoshi Nakamoto

The internet had transformed communication, publishing and commerce, yet moving money online still required banks and payment processors to act as trusted intermediaries. Those intermediaries were useful—they resolved disputes, reversed fraudulent transactions and maintained account balances—but they also introduced costs, delays and, crucially, trust.

Nakamoto's answer was to combine ideas that already existed into a self reinforcing system. Transactions would be grouped into blocks and recorded on a public ledger maintained by thousands of independent computers. Proof of work, borrowed and adapted from Hashcash, would determine who earned the right to add the next block, while making attempts to rewrite history prohibitively expensive. No bank would verify payments because, collectively, the network would do that instead.

The timing, of course, helped. Bitcoin appeared just as confidence in the traditional financial system was collapsing. Governments were rescuing banks with taxpayer money while central banks were taking unprecedented measures to stabilise financial markets. Against that backdrop, a monetary system that claimed not to require trusted institutions suddenly looked less like an academic curiosity and more like a plausible alternative (whether it ultimately became one is of course a different question).

## Early Bitcoin usage

Bitcoin did not become money overnight. In fact, for much of its early life it was not entirely obvious that it was anything at all.
The network came online on 3 January 2009, when Satoshi Nakamoto mined the Genesis Block. Embedded inside it was a now-famous headline from The Times:

> The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.

The message served as a timestamp, proving when the block was created. It also read like a mission statement. Bitcoin was arriving at precisely the moment trust in the banking system was collapsing.
Nine days later, Nakamoto sent 10 bitcoins to the cryptographer Hal Finney, the first transaction on the network. For the next year, however, Bitcoin remained largely an experiment among a small group of cryptographers and hobbyists. There was no obvious market price because there was no obvious market.

The first widely recognised commercial transaction came in May 2010, when Laszlo Hanyecz paid 10,000 bitcoins for two pizzas. The purchase has since become legendary, largely because those bitcoins would eventually be worth hundreds of millions of dollars. At the time, though, the more interesting fact was simply that someone had accepted Bitcoin in exchange for something tangible. The network had crossed an important threshold. Bitcoin had stopped being merely an interesting protocol and become, however briefly, a medium of exchange.
It did not remain one for long.
As Bitcoin attracted more users, exchanges emerged to connect it with traditional currencies. The largest, Mt. Gox, eventually handled the majority of Bitcoin trading worldwide. This solved one problem—liquidity—but quietly reintroduced another. People no longer held bitcoins themselves; they increasingly trusted exchanges to do it for them; this will become a recurring theme.

The years that followed were turbulent. Bitcoin suffered software bugs, exchange failures, spectacular price bubbles and equally spectacular crashes. Mt. Gox itself collapsed in 2014 after losing roughly 850,000 bitcoins, demonstrating that while Bitcoin's protocol had proven remarkably resilient, the institutions growing around it often were not. Yet Bitcoin kept surviving.

Each crisis eliminated weak businesses rather than the network itself. Developers continued improving the protocol through upgrades such as SegWit, while entrepreneurs built wallets, exchanges and payment infrastructure around it. By the end of the decade, the question was no longer whether Bitcoin would continue to exist. It was what, exactly, it had become.

## Bitcoins maturation and institutional adoption

Somewhere along the way, Bitcoin quietly stopped trying to become money. That is perhaps an overstatement, plenty of people still bought coffee with Bitcoin. But by the late 2010s, the conversation had noticeably shifted. Bitcoin was discussed less as a payment system and more as an investment. The synopsis was now more digital gold than the original peer to peer electronic cash.

This was not entirely irrational. Bitcoin's supply is fixed at 21 million coins, enforced by software (as opposed to central banks or governments). Gold is valuable, at least in part, because nobody can simply decide to double the world's supply overnight. Bitcoin offered a digital version of that same scarcity. Whether it was good money remained debatable. As a scarce asset, however, it became increasingly compelling.

The speculative boom of 2017 accelerated that transition. Prices approached $20,000 before collapsing the following year, leading many observers to conclude that Bitcoin itself had failed. Instead, something slightly stranger happened. The speculation may have disappeared but the great infrastructure bitcoin had built up remained and improved. Exchanges became more sophisticated, institutional custody improved, and an ecosystem of brokers, market makers and financial services quietly continued to expand; financial bubbles have a habit of leaving useful things behind.

The COVID-19 pandemic pushed Bitcoin further in the same direction. As governments injected unprecedented amounts of liquidity into the global economy, investors became increasingly interested in assets whose supply could not be expanded at will. Companies such as MicroStrategy, followed by Tesla and others, began holding Bitcoin on their balance sheets, not because they intended to spend it, but because they wanted to own it.
The final step was perhaps the most ironic.

For years, buying Bitcoin meant opening an account at a cryptocurrency exchange, managing private keys and accepting the peculiar risks that came with self custody. Spot Bitcoin ETFs, approved in the United States in 2024, removed almost all of that friction. 

Investors could now gain exposure to Bitcoin through the same brokerage accounts they used to buy index funds. They did not need to understand wallets, mining or blockchains. They only needed to click buy. This was a remarkable achievement for bitcoin and crypto in general. It was also a remarkable reversal.

Bitcoin had been created as a way to avoid trusted financial intermediaries. Fifteen years later, its greatest commercial success came when the world's largest financial institutions, including BlackRock and Fidelity, made it possible for millions of people to own Bitcoin without interacting with the Bitcoin network at all.

In many respects, bitcoin was now part of the financial system.

## The electronic tulip

> Bitcoin turned out not to be a currency. It is an electronic tulip perhaps; but not a currency.
> <cite>Nassim Nicholas Taleb

Taleb's criticism is deliberately provocative, but it raises a useful question: what is Bitcoin actually for?

Its white paper describes a peer to peer electronic cash system. Fifteen years later, that is not how most people use it. Salaries are not denominated in Bitcoin. Supermarkets do not price goods in satoshis. Businesses rarely keep their books in BTC. Most people who acquire Bitcoin do so for the same reason they buy gold or shares in a technology company: they expect the price to rise.

That transformation is understandable. A currency whose purchasing power routinely moves by five or ten percent in a day is difficult to use as money. If tomorrow's exchange rate is radically different from today's, both buyers and sellers have an incentive to delay spending it. Scarcity, which makes Bitcoin attractive as an investment, also contributes to its volatility. The qualities that helped create a valuable asset are not necessarily the qualities that create a stable currency.

Bitcoin's costs also remain difficult to ignore. Proof of work is an elegant solution to the problem Nakamoto was trying to solve, but elegant does not necessarily mean efficient. The network expends enormous amounts of energy to secure a payment system that processes far fewer transactions than conventional payment networks. Bitcoin's supporters argue that this is the unavoidable cost of decentralisation. Its critics see it as evidence that decentralisation may simply be too expensive.

Perhaps the biggest surprise, however, is not technological but institutional.

Bitcoin was designed to remove trusted intermediaries from finance. Instead, it created demand for new ones. Exchanges became custodians. Custodians became ETF providers. Today, millions of investors gain exposure to Bitcoin through institutions such as BlackRock and Fidelity without ever interacting with the network itself. Bitcoin did not eliminate finance. It became another asset that finance could package, custody and sell.
That is not necessarily a failure. Markets have a habit of absorbing innovations rather than being displaced by them. The eurodollar market did not replace banking; it became banking. Derivatives did not eliminate cash markets; they became part of them. Bitcoin may simply be following the same pattern.

Whether that represents success or failure depends on what one believes Bitcoin was supposed to achieve.

If its goal was to create a scarce digital asset, the experiment has been spectacularly successful. If its goal was to become everyday money independent of financial institutions, the outcome looks considerably less clear. Bitcoin has not become the peer to peer electronic cash system Nakamoto described. It has become something else: a globally traded financial asset whose greatest triumph may have been convincing the financial system to embrace it.