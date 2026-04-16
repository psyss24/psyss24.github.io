import numpy as np
import matplotlib.pyplot as plt

X = np.linspace(-3, 3, 500)

# Theme-driven globals (set by apply_theme)
COLORS = []
AXIS_COLOR = "#111111"
OUTPUT_SUFFIX = ""


def apply_theme(mode):
    global COLORS, AXIS_COLOR, OUTPUT_SUFFIX

    base_style = {
        "font.family": "serif",
        "font.serif": ["DejaVu Serif"],
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.grid": False,
        "figure.autolayout": True,
        "legend.facecolor": "none",
        "legend.edgecolor": "none",
        "savefig.facecolor": "none",
        "savefig.edgecolor": "none",
        "figure.facecolor": "none",
        "axes.facecolor": "none",
    }

    if mode == "dark":
        OUTPUT_SUFFIX = "-dark"
        COLORS = ["#7DD3FC", "#34D399", "#FBBF24", "#F97316", "#A78BFA"]
        AXIS_COLOR = "#D1D5DB"
        theme_style = {
            "text.color": "#E5E7EB",
            "axes.labelcolor": "#E5E7EB",
            "axes.edgecolor": "#6B7280",
            "axes.titlecolor": "#F9FAFB",
            "xtick.color": "#CBD5E1",
            "ytick.color": "#CBD5E1",
        }
    else:
        OUTPUT_SUFFIX = ""
        COLORS = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"]
        AXIS_COLOR = "#111111"
        theme_style = {
            "text.color": "#111111",
            "axes.labelcolor": "#111111",
            "axes.edgecolor": "#111111",
            "axes.titlecolor": "#111111",
            "xtick.color": "#374151",
            "ytick.color": "#374151",
        }

    plt.rcParams.update(base_style)
    plt.rcParams.update(theme_style)


def save_fig(name, tight=True):
    save_kwargs = {
        "dpi": 300,
        "transparent": True,
    }
    if tight:
        save_kwargs["bbox_inches"] = "tight"
    plt.savefig(f"{name}{OUTPUT_SUFFIX}.png", **save_kwargs)
    plt.close()

# --- 1. Linear to Hinge ---
def fig1():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
    y_lin = 0.7 * X + 0.5
    y_hinge = np.maximum(0, y_lin)
    
    ax1.plot(X, y_lin, color=COLORS[0], lw=2)
    ax1.axhline(0, color=AXIS_COLOR, lw=0.5); ax1.axvline(0, color=AXIS_COLOR, lw=0.5)
    ax1.set_title("Base Linear Function", fontsize=11)
    
    ax2.plot(X, y_hinge, color=COLORS[4], lw=2.5)
    ax2.plot(X, y_lin, color=COLORS[0], lw=1, ls='--', alpha=0.3)
    ax2.axhline(0, color=AXIS_COLOR, lw=0.5); ax2.axvline(0, color=AXIS_COLOR, lw=0.5)
    ax2.set_title("ReLU Transformation (The Joint)", fontsize=11)
    
    save_fig("01_linear_to_hinge")

# --- 2. The Patchwork Sum ---
def fig2():
    plt.figure(figsize=(7, 4))
    h1 = 0.6 * np.maximum(0, X + 1.5)
    h2 = -0.9 * np.maximum(0, X - 0.5)
    h3 = 0.4 * np.maximum(0, -X + 1)
    y = h1 + h2 + h3

    # Plot components only where they are active to avoid misleading color overlap on y=0.
    h1_active = X > -1.5
    h2_active = X > 0.5
    h3_active = X < 1.0

    h1_plot = np.where(h1_active, h1, np.nan)
    h2_plot = np.where(h2_active, h2, np.nan)
    h3_plot = np.where(h3_active, h3, np.nan)

    # Draw axis baseline behind curves so crossings at y=0 remain visible.
    plt.axhline(0, color=AXIS_COLOR, lw=0.5, alpha=0.7, zorder=0)

    plt.plot(X, h1_plot, color=COLORS[1], alpha=0.75, ls='--', lw=1.9, label="h1", zorder=2)
    plt.plot(X, h2_plot, color=COLORS[3], alpha=0.75, ls='--', lw=1.9, label="h2", zorder=2)
    plt.plot(X, h3_plot, color=COLORS[4], alpha=0.75, ls='--', lw=1.9, label="h3", zorder=2)
    plt.plot(X, y, color=COLORS[0], lw=2.8, label="Sum (y)", zorder=3)
    plt.legend(frameon=False)
    save_fig("02_patchwork_sum")

# --- 3. The 2D Fence ---
def fig4():
    plt.figure(figsize=(5, 5))
    x_range = np.linspace(-2, 2, 100)
    # x2 = -x1 + 0.5
    plt.plot(x_range, -1*x_range + 0.5, color=COLORS[4], lw=2)
    plt.fill_between(x_range, -1*x_range + 0.5, 2, color=COLORS[4], alpha=0.1)
    plt.xlim(-2, 2); plt.ylim(-2, 2)
    plt.xlabel("x1"); plt.ylabel("x2")
    plt.axhline(0, color=AXIS_COLOR, lw=0.5); plt.axvline(0, color=AXIS_COLOR, lw=0.5)
    save_fig("03_2d_fence")

# --- 4. Neighborhoods (Linear Regions) ---
def fig5():
    plt.figure(figsize=(6, 6))
    x1, x2 = np.meshgrid(np.linspace(-2, 2, 300), np.linspace(-2, 2, 300))
    # 5 random hyperplanes
    n1 = (x1 + x2 - 0.5) > 0
    n2 = (-x1 + 0.5*x2 + 0.2) > 0
    n3 = (0.2*x1 - x2 + 0.8) > 0
    n4 = (x1 - 0.2) > 0
    n5 = (x2 + 0.4) > 0
    
    regions = n1.astype(int) + 2*n2.astype(int) + 4*n3.astype(int) + 8*n4.astype(int) + 16*n5.astype(int)
    plt.imshow(regions, extent=[-2, 2, -2, 2], origin='lower', cmap='tab20b', alpha=0.4)
    plt.title("Linear Regions in 2D Space", fontsize=11)
    save_fig("04_neighborhoods")

# --- 5. A Single Fold ---
def fig6():
    plt.figure(figsize=(7, 4))
    # f(x) = ReLU(1 - ReLU(x))
    layer1 = np.maximum(0, X)
    layer2 = np.maximum(0, 1 - layer1)
    
    plt.plot(X, layer1, color=COLORS[1], alpha=0.3, ls='--', label="Layer 1 (Linear)")
    plt.plot(X, layer2, color=COLORS[4], lw=2.5, label="Layer 2 (Folded)")
    plt.legend(frameon=False)
    plt.axhline(0, color='black', lw=0.5)
    save_fig("05_single_fold")

# --- 6. Hierarchical Assembly ---
def fig7():
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 4))
    x_c = np.linspace(-1, 1, 100)
    
    # Primitives: Lines
    ax1.plot(x_c, x_c, color=COLORS[1]); ax1.plot(x_c, -x_c, color=COLORS[1])
    ax1.set_title("1. Linear Primitives", fontsize=11)
    
    # Mid-stage: Hinges
    ax2.plot(x_c, np.maximum(0, x_c + 0.5), color=COLORS[4])
    ax2.plot(x_c, np.maximum(0, -x_c + 0.5), color=COLORS[4])
    ax2.set_title("2. Local Hinges", fontsize=11)
    
    # Global: Shape
    ax3.plot(x_c, np.maximum(0, 0.5 - np.abs(x_c)), color=COLORS[0], lw=2)
    ax3.set_title("3. Global Object", fontsize=11)
    
    for ax in [ax1, ax2, ax3]:
        ax.set_xticks([]); ax.set_yticks([])
    save_fig("06_hierarchical_assembly")

# --- 7. Redundancy (Family of Solutions) ---
def fig8():
    x = np.linspace(-2.2, 2.2, 600)
    target = np.maximum(0, 1 - np.abs(x))

    # Solution A: classic three-hinge decomposition.
    a1 = np.maximum(0, x + 1)
    a2 = -2.0 * np.maximum(0, x)
    a3 = np.maximum(0, x - 1)
    y_a = a1 + a2 + a3

    # Solution B: mirrored hinge family with an explicit bias term.
    b1 = np.maximum(0, x + 1)
    b2 = -np.maximum(0, x)
    b3 = np.maximum(0, -x + 1)
    b4 = -np.maximum(0, -x)
    b_bias = -1.0
    y_b = b_bias + b1 + b2 + b3 + b4

    fig = plt.figure(figsize=(12, 6.6))
    fig.set_layout_engine('none')
    grid = fig.add_gridspec(2, 2, height_ratios=[1.0, 1.35], hspace=0.18, wspace=0.16)

    ax_a_units = fig.add_subplot(grid[0, 0])
    ax_b_units = fig.add_subplot(grid[0, 1], sharex=ax_a_units)
    ax_a_out = fig.add_subplot(grid[1, 0], sharex=ax_a_units)
    ax_b_out = fig.add_subplot(grid[1, 1], sharex=ax_a_units, sharey=ax_a_out)

    # Internal components for Solution A.
    ax_a_units.plot(x, a1, color=COLORS[1], ls='--', lw=1.7, alpha=0.8, label='h1')
    ax_a_units.plot(x, a2, color=COLORS[3], ls='--', lw=1.7, alpha=0.8, label='h2')
    ax_a_units.plot(x, a3, color=COLORS[4], ls='--', lw=1.7, alpha=0.8, label='h3')
    ax_a_units.set_title("Solution A Internals", fontsize=10)
    ax_a_units.legend(frameon=False, ncol=3, fontsize=8, loc='upper center')

    # Internal components for Solution B.
    ax_b_units.plot(x, b1, color=COLORS[1], ls='--', lw=1.7, alpha=0.8, label='u1')
    ax_b_units.plot(x, b2, color=COLORS[3], ls='--', lw=1.7, alpha=0.8, label='u2')
    ax_b_units.plot(x, b3, color=COLORS[4], ls='--', lw=1.7, alpha=0.8, label='u3')
    ax_b_units.plot(x, b4, color=COLORS[2], ls='--', lw=1.7, alpha=0.8, label='u4')
    ax_b_units.plot(x, np.full_like(x, b_bias), color=AXIS_COLOR, ls=':', lw=1.4, alpha=0.8, label='bias')
    ax_b_units.set_title("Solution B Internals", fontsize=10)
    ax_b_units.legend(frameon=False, ncol=5, fontsize=8, loc='upper center')

    # Outputs: both match the same target exactly.
    ax_a_out.plot(x, target, color=AXIS_COLOR, ls=':', lw=2.0, alpha=0.85, label='target')
    ax_a_out.plot(x, y_a, color=COLORS[0], lw=2.8, label='sum (A)')
    ax_a_out.set_title("Output of Solution A", fontsize=10)

    ax_b_out.plot(x, target, color=AXIS_COLOR, ls=':', lw=2.0, alpha=0.85, label='target')
    ax_b_out.plot(x, y_b, color=COLORS[0], lw=2.8, label='sum (B)')
    ax_b_out.set_title("Output of Solution B", fontsize=10)

    for ax in [ax_a_units, ax_b_units, ax_a_out, ax_b_out]:
        ax.axhline(0, color=AXIS_COLOR, lw=0.5, alpha=0.7, zorder=0)
        for knot in (-1, 0, 1):
            ax.axvline(knot, color=AXIS_COLOR, lw=0.45, alpha=0.2, zorder=0)
        ax.set_xlim(-2.1, 2.1)

    for ax in [ax_a_units, ax_b_units]:
        ax.set_xticks([])
        ax.set_yticks([])

    for ax in [ax_a_out, ax_b_out]:
        ax.set_ylim(-0.12, 1.15)
        ax.legend(frameon=False, fontsize=8, loc='upper right')

    fig.subplots_adjust(left=0.05, right=0.98, bottom=0.08, top=0.95)
    save_fig("07_redundancy", tight=False)

if __name__ == "__main__":
    for mode in ("light", "dark"):
        apply_theme(mode)
        fig1(); fig2(); fig4(); fig5()
        fig6(); fig7(); fig8()

    print("Pedagogical figures generated successfully for light and dark modes.")
