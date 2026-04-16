# A Geometric Intuition of Neural Networks

  

I offer a short geometric driven intro to Neural Network Math.



## Neural Networks

Neural networks under the hood are quite mechanical and I found, when learning it myself, coming at it from a geometric side makes the math much more logical and purposeful. Modern AI is built from rigid and flat parts that solve complex problems by stitching together millions of tiny flat surfaces into a high dimensional patchwork.

  

## 1. Hinges Make Lines Snap

  

To illustrate simple shallow neural networks we begin with a single dimensional input $x$. We pass this input into a hidden unit which starts as a simple linear equation that is a linear function of the input $x$: $[\theta_{10} + \theta_{11}x]$

  

Before any complex transformations occur, this is just a simple linear function and with just this alone you'll find it difficult to approximate anything complex.

  

Imagine you are trying to trace a mountain range using only a single straight ruler. No matter how you tilt the ruler, you can only ever represent a single slope. To trace the peaks and valleys, you need the ruler to break or hinge at specific points.

  

In a neural network, the activation function in a (hidden unit)[an individual 'neuron' inside the network that performs a simple calculation on the input before passing it to the next layer.](#) ($h_1$) provides that hinge. The hidden unit starts as a simple linear equation that is a linear function of the input $x$: $[\theta_{10} + \theta_{11}x]$. Left alone, this is just a straight line.

  

There isn't much you can do with a simple linear line which is why we need some mechanism to introduce non-linearity, specifically we pass in our linear equation into something called an activation function that decides if a neuron's signal is _important_ enough to pass forward.

Without it, no matter how many layers you add to a network, the math would always collapse into one

single straight line. Here I'll describe the ReLU activation function. There are many more activation functions each different from one another, but I feel ReLU is the simplest. Also, many textbooks offer ReLU as the first activation function to introduce neural networks with and I won't break that tradition.

  
  

We define the ReLU activation function as $a[z] = \max(0, z)$ and so we would pass in $[\theta_{10} + \theta_{11}x]$ for $z$.

![Linear to hinge plot](media/nn_plots/01_linear_to_hinge.png)
*Figure 1: Comparison between a standard linear function (left) and the ReLU transformation (right). Note how ReLU clips the signal at zero, creating a sharp joint or hinge.*

  

ReLU acts like a selective clip: if the line's output is negative, it snaps to zero. If it's positive, it stays as it is. This creates a joint in the function. By combining several of these broken lines, we get a piecewise linear function:

$$y = \phi_0 + \sum_{i=1}^{3} \phi_i a[\theta_{i0} + \theta_{i1}x]$$

![Patchwork sum plot](media/nn_plots/02_patchwork_sum.png)
*Figure 2: The summing of multiple hinges ($h_1, h_2, h_3$) to create a complex, jagged output path ($y$). Each hidden unit contributes one unique joint to the final shape.*

  

Mathematically, the (parameters)[the internal settings weights and biases that a network adjusts during training to change its behavior and fit the data.](#) have specific roles in this snapping process:

  

* **The $\theta$ parameters** determine the **location** of the hinge (the bias) and the **slope** of the line before it breaks.

  

* **The $\phi$ parameters** determine the **height** and **contribution** of that specific hinge to the final output.

  

  

## 2. Higher Dimensions, Fences and Neighborhoods

  

When we move from one input to two (like $x_1$ and $x_2$), we are no longer breaking a line; we are creasing a flat sheet of paper. Imagine a perfectly flat field. A single neuron acts like a **(hyperplane)[a flat boundary that exists in higher dimensions, acting like a fence to divide the data into different categories or regions.](#)** running across that field.

![2D fence plot](media/nn_plots/03_2d_fence.png)
*Figure 3: A hyperplane in 2D space acting as a boundary. The shaded region indicates where the neuron is active, adding its slope to the output landscape.*

  

On one side of the fence, the neuron is **Active** and adds its slope to the landscape. On the other side, it is **Inactive** and contributes nothing. When you have hundreds of these fences intersecting at different angles, they carve the field into many small neighborhoods.

  

In technical terms, these neighborhoods are called **(Linear Regions)[specific areas in the input space where the network behaves like a single simple linear function because the same neurons are firing.](#)**. Within any single region, the (Activation Pattern)[the specific combination of which neurons are currently 'on' and which are 'off' for a given input.](#), the list of which neurons are on or off, never changes. Because the combination of active neurons is constant inside that patch, the network's output is literally just a simple, flat plane for that specific area:

  

$$w_1x_1 + w_2x_2 + \dots + b = 0$$

![Neighborhoods plot](media/nn_plots/04_neighborhoods.png)
*Figure 4: Intersecting hyperplanes carve the input space into distinct linear regions. Each colored polygon represents a unique activation pattern where the network behaves linearly.*

  

By optimising the orientation (weights) and location (biases) of these fences, the network can approximate incredibly jagged and complex surfaces by making the neighborhoods small enough that the seams become invisible.

  

  

## 3. Benefits of Deep Layers

  

While a shallow network can theoretically approximate any function by adding enough hidden units (width), deep networks offer fundamental advantages by composing these linear transformations across multiple layers. This shift from a single layer to a hierarchical structure changes how the network partitions the input space.

  

### 3.1 Folding in Deep Layers

  

In a shallow network, the input space is divided into linear regions based on the activation patterns of its hidden units. However, when we add a second layer, it does not take the original input $x$. Instead, it takes the already partitioned output of the first layer.

![Single fold plot](media/nn_plots/05_single_fold.png)
*Figure 5: Visualising the folding effect of depth. The second layer takes the first layer's hinge and wraps it back on itself, creating a mountain peak from simple linear primitives.*

  

A hidden unit in the second layer ($h'$) is a function of the first layer's activations ($h$):

  

$$h'_{1} = a[\psi_{10} + \psi_{11}h_{1} + \psi_{12}h_{2} + \psi_{13}h_{3}]$$

And recall the first layer's hidden unit is a function of the inputs we pass. Each hidden unit in the first layer modifies this input, multiplying it by some unique, learned weight and summing it with a bias before passing it into an activation function. That output then serves as the input for the hidden units in layer 2. In a deep network with $n$ layers this keeps repeating until we read the $n^{th}$ (final) layer.

  

The funny looking $\psi$ (psi) parameters in the above equation are therefore composite values that represent the combined weights and biases of the previous layers and they describe how signals are transformed as they pass deeper into the network.

  

Geometrically, the first layer folds the input space and subsequent layers wrap or refold those segments. This composition allows for a combinatorial explosion in the number of linear regions:

* **Shallow:** A network with $D$ units creates $D+1$ regions.

* **Deep:** A network with $K$ layers of $D$ units can generate up to $(D+1)^K$ regions.

### 3.2 Structure and Optimisation

![Hierarchical assembly plot](media/nn_plots/06_hierarchical_assembly.png)
*Figure 6: Local-to-global processing. Early layers identify simple primitives like lines and hinges, which deeper layers then assemble into complex global objects.*

  

Deep layers grant us the ability to create exponentially more regions with fewer parameters. But there are more advantages to deep layers than that; by layering these transformations, the network can have a localtoglobal processing flow. Imagine processing an image through a network with many layers; given our many layers, early ones can identify simple primitives (like edges or small linear breaks) and deeper layers can assemble them into complex objects. This is a structurally necessary for large, high dimensional inputs like images, where a flat architecture would struggle to coordinate regions of the input space simultaneously.

  

Shallow networks are often brittle; because they lack intermediate layers, there is often only one specific way for the parameters to align to solve a complex problem. With deep networks because there are many different combinations of folds across multiple layers that can result in the same global output, the network has access to a **large family of similar solutions**. This redundancy makes moderately deep networks easier to train, as the optimisation algorithm is more likely to fall into a functional configuration.

![Redundancy plot](media/nn_plots/07_redundancy.png)
*Figure 7: Redundancy in deep networks. The top row shows two different internal decompositions, while the bottom row shows that both sums reproduce the exact same output function.*

  

  
## 4. Matrix Management

As networks grow to include billions of parameters, calculating these hinges one by one becomes impossible. We need a way to move all those fences simultaneously. This is where (Matrix Notation)[a compact mathematical language used to represent large grids of numbers and operations, allowing us to compute millions of neuron activations at once.](#) comes in.


We group all the slopes into a weight matrix ($\Omega$) and all the thresholds into a bias vector ($\beta$), where $h$ represents the activation of a hidden unit and $k$ indexes which layer we are computing:

$$h_k = a[\beta_{k-1} + \Omega_{k-1} h_{k-1}]$$
$$y = \beta_K + \Omega_K h_K$$

Multiplying an input by $\Omega$ literally transforms space, rotating, stretching, or shearing the coordinate system. The hyperplanes from Section 2 do not move on their own; it is the weight matrix that repositions them as the network learns.

Stacking layers means composing these transformations one after another. Each $\Omega$ folds the space once more and the network learns by adjusting those folds until the resulting piecewise patchwork perfectly matches the data (whether that data represents pixels in an image or the volatility of a stock price).

## 5. The Final Layer

Every layer transform the space so that the problem becomes easier to solve. The final layer has a different job and that is to give an answer.

What that answer looks like depends on what you are asking. If the network is deciding between categories, the final layer produces one number per class. These numbers are raw scores called (logits)[the unnormalised output scores of the final layer, representing how strongly the network votes for each 
class before being converted to probabilities.](#), reflecting how strongly the network votes for each option. A function called (Softmax)[a mathematical function that converts a vector of raw scores into a probability distribution, ensuring all values are positive and sum to 
one.](#) then squashes them into a probability distribution that sums to one. If the network is predicting a continuous value, the final layer skips this step entirely and outputs a single number directly.

The final layer is drawing a decision boundary through the transformed space it inherited from all the layers before. By the time data reaches it, the previous layers have done their folding, ideally warping the space so that different classes sit in cleanly separable regions. The final layer then can simply find the hyperplane that separates them.

What begins as a single hinge snapping a line eventually becomes a composition of matrix transformations, folding a high dimensional space until the shape of the data and the shape of the network are one and the same.