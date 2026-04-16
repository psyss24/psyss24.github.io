# The Measurement and Modeling of Financial Volatility

Price is what we see, risk is what we infer; I summarise the development of volatility forecasting models, focusing on how each one scrutinises the assumptions of the last.


When we look at the financial markets we usually focus on the price of an asset. If a stock is 100 today and 105 tomorrow we see a 5% gain. But price only tells part of the story. To understand the safety or risk of that asset there is also a *hidden* dimension: **(volatility)[a measure of the dispersion or spread of returns; high volatility indicates sharp price swings while low volatility suggests stability.](#)**. 

Volatility is a **(latent variable)[a variable that is not directly observed but is instead inferred from other variables that are observed.](#)**. Unlike price or volume you cannot see volatility directly on a screen. You can only observe how much the price fluctuates and then calculate the intensity of the process that generated those movements. Accurately measuring this intensity is the difference between gambling and disciplined finance. If we underpredict volatility we might take on more risk than we can handle; if we overpredict it we might miss out on valuable opportunities.

## 1. Logarithmic Returns

To measure this intensity we first need a consistent way to track price movements. While we often think in simple percentages technical modeling relies on **(log returns)[the natural logarithm of the ratio of two consecutive prices providing mathematical benefits like additivity over time.](#)**. 

If $P_t$ is the price today and $P_{t-1}$ is the price yesterday the log return ($r_t$) is calculated as:
$$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)$$

We use this form because it treats growth and decay symmetrically and makes returns additive over time. If you have the log returns for Monday and Tuesday you can simply add them together to get the total return for both days. This consistency in the math is important for calculating the spread of returns across different time periods. In this framework, volatility is defined as the standard deviation of these $r_t$ values.

## 2. Historical Volatility

The simplest way to estimate this spread is to assume that the market follows a constant level of randomness, an assumption known as **(homoscedasticity)[the assumption that the variance of a series remains constant over time.](#)**. 

To measure this we use **Historical Volatility (HV)** which calculates the standard deviation of returns over a fixed window of time (such as the last 20 days):
$$\sigma^2 = \frac{1}{n-1}\sum_{i=1}^n (r_i - \bar{r})^2$$

This approach provides a retrospective snapshot of how much an asset fluctuated in the past. However it is flawed: it treats every day in the window as equally important. It assumes that a massive market shock from three weeks ago has the same relevance to today's risk as a shock that happened yesterday. 

## 3. From Static to Conditional

Real markets do not behave with constant randomness. Instead they exhibit **volatility clustering**: periods of high fluctuation tend to cluster together and periods of calm do the same. This means that volatility is not a static property of the asset but a shifting state of the market. To model this we must distinguish between two types of variance:

*   **Unconditional Variance:** The long run average level of risk.
*   **Conditional Variance:** The risk at this exact moment given what happened yesterday. 

Because volatility is autoregressive, meaning its state today is a function of its state yesterday, we cannot rely on simple averages; we need a system that can update its risk estimate in real time.

## 4. The ARCH Model

In 1982 Robert Engle developed the **(ARCH)[Autoregressive Conditional Heteroscedasticity: a statistical model used to describe the changing variance of a time series based on past errors.](#)** model to capture this dynamic behavior. The core logic is that the return $y_t$ is composed of a random noise term $\epsilon_t$ multiplied by the current intensity of volatility $\sqrt{h_t}$:

$$y_t = \epsilon_t \sqrt{h_t}$$

The intensity $h_t$ is our **conditional variance** and it is calculated using the most recent error in the data:
$$h_t = \alpha_0 + \alpha_1 y_{t-1}^2$$

In this system:
*   **$\alpha_0$** is the long run variance floor. It ensures that volatility never drops to zero.
*   **$\alpha_1$** is the weight we give to yesterday's shock.

If the market was shaken yesterday the $y_{t-1}^2$ term spikes causing the model to output a wider range of possible outcomes for today. This captures the mechanical reality of risk: when the market is jittery the range of what could happen next becomes physically larger. 

## 5. The GARCH Model

The ARCH model is a significant step forward because it acknowledges that volatility clusters. However it has a short memory; it only looks at the immediate shock of yesterday. In the real world volatility does not just spike and disappear, instead it decays. This is known as **persistence**. If a major geopolitical event shakes the market on Monday investors do not simply forget about it by Wednesday. The uncertainty lingers as participants digest the news and adjust their positions.

To model this lingering effect we move to the **(GARCH)[Generalized Autoregressive Conditional Heteroscedasticity: an extension of the ARCH model that adds a 'memory' component allowing today's volatility to depend on both past shocks and past volatility estimates.](#)** model. While ARCH looks only at the squared error of the last period GARCH adds a second component, the previous estimate of volatility itself:

$$h_t = \alpha_0 + \alpha_1 y_{t-1}^2 + \beta h_{t-1}$$

In this equation the **$\beta$** (beta) parameter represents the machines memory. By including the previous day’s variance ($h_{t-1}$) in the calculation the model ensures that once volatility spikes it takes time to wash out of the system. This creates a much more realistic decay pattern where shocks fade slowly like ripples in a pond rather than vanishing instantly. This model is the industry standard because it recognizes that risk has a long term dependency that simple reactive models miss.

## 6. GJR-GARCH

Even with memory our models still treat all shocks as equal. Mathematically a 5% gain and a 5% loss both result in the same $y_{t-1}^2$ value. But for a human investor these two events are fundamentally different. Markets exhibit an asymmetric response to news: price drops typically trigger far more volatility than price rises of the same magnitude.

This is often explained by the **(leverage effect)[the observation that volatility tends to increase more following a price drop than a price rise of the same magnitude often linked to the increased riskiness of a firm's debt-to-equity ratio.](#)**. When a firms stock price falls its market value decreases while its debt stays the same. This makes the firm more leveraged and inherently riskier which in turn drives up volatility. 

To capture this human reality we use the **GJR-GARCH** model:

$$h_t = \alpha_0 + (\alpha_1 + \gamma I_{t-1}) y_{t-1}^2 + \beta h_{t-1}$$

The innovation here is the **$\gamma$** (gamma) term and the indicator **$I_{t-1}$**. The indicator acts like a switch that turns on (1) only when yesterday’s return was negative and stays off (0) otherwise. If the market dropped yesterday the model applies an extra weight $\gamma$ to that shock. This allows the system to predict a higher level of risk following bad news than it would for good news of the same size.

## 7. Range-Based Estimation

So far we have relied entirely on the closing price to calculate returns. This assumes that the only thing that matters is where the price was at the end of the day. But this is a grainy view of the market. Imagine an asset that opens at 100 goes on a wild ride to 110 then crashes to 90 before finally closing back at 100. A closing price model would see this as zero volatility. 

To get a clearer signal we use **Range-Based Estimators** like the **Parkinson Estimator**. Instead of a single snapshot at the end of the day these look at the **(High, Low, and Open)[using the full range of a day's trading activity to estimate volatility which provides a much higher-resolution signal than the closing price alone.](#)** prices:

$$\sigma^2 = \frac{1}{4n \ln 2} \sum_{i=1}^n \left( \ln \frac{H_i}{L_i} \right)^2$$

By using the ratio between the daily High ($H_i$) and Low ($L_i$) this estimator captures the width of the intraday struggle. It is significantly more efficient than closing-price measures because it sees the internal intensity that was previously invisible. More advanced versions like the **Yang-Zhang Estimator** go even further by handling the **(overnight jump)[the price gap that often occurs between the market close of one day and the market open of the next.](#)** and the intraday drift providing a high definition view of the asset’s true randomness.

## 8. The HAR-RV Model

Finally we must address the fact that the market is not a single entity. It is a **(Heterogeneous Market)[a market composed of many different participants—from high-frequency traders to long-term pension funds—each operating on different time scales.](#)**. Risk exists in different gears: the immediate response of day traders the medium term trend of swing traders and the long term environment of pension funds.

The **HAR-RV** model predicts today's risk by taking a weighted average of these three different timelines:

$$RV_{t+1} = \beta_0 + \beta_d RV_t^{(d)} + \beta_w RV_t^{(w)} + \beta_m RV_t^{(m)}$$

This equation describes volatility as a cascade:
*   **$RV_t^{(d)}$**: The Daily gear (the last 24 hours).
*   **$RV_t^{(w)}$**: The Weekly gear (the last 5 days).
*   **$RV_t^{(m)}$**: The Monthly gear (the last 22 days).

By aggregating these components the model recognises that today’s volatility is the result of many different timelines clashing at once.

## 9. ML And Relaxing the Structure of Volatility

We began with simple returns and treated volatility as a fixed property, summarised by a single number which is a view that breaks almost immediately under real market behaviour. Volatility reacts and is not constant. ARCH makes it reactive to shocks whilst GARCH gives it memory. GJR-GARCH acknowledges that not all shocks are equal. Range based estimators improve the quality of the signal itself. HAR-RV recognises that the market is may be operating on different timescales. Each model does not replace the previous one so much as expose what it was missing.

Modelling volatility is challenging because you are trying to track the state of the market as it evolves. And that state is never directly visible. It has to be inferred, updated, and, inevitably approximated. Every model in this progression is an attempt to make that approximation slightly less naive by making its assumptions more aligned with how markets actually behave. Machine Learning approaches to modelling volaility are a little different in this regard.

Instead of specifying in advance how volatility should react, how long it should remember, or which time scales matter, deep learning models attempt to _learn_ those relationships directly from the data. Recurrent architectures and sequence models, for example, implicitly capture persistence and decay without requiring a fixed GARCH structure. Attention based models go further by allowing the system to dynamically decide which past events matter most, rather than weighting them through a predefined formula.

So this progression does not end with a final model, but with a shift in approach. From hardcoding a structure to volatility to letting it emerge from data, whilst of course accepting that it can only ever be estimated and never directly observed.