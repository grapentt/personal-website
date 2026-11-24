import numpy as np
import matplotlib.pyplot as plt
import imageio
import io

# Use a dark background for a mysterious effect
plt.style.use('dark_background')

# Nonlinear transformation function (fixes origin)
def T(x, y, t):
    return x + t * 0.5 * np.sin(y), y + t * 0.5 * np.sin(x)

# Define grid boundaries (extended beyond frame)
x_min, x_max = -5, 5
y_min, y_max = -5, 5

# Define grid spacing (wider gaps for clarity)
grid_spacing = 1.0
x_lines = np.arange(x_min, x_max + grid_spacing, grid_spacing)
y_lines = np.arange(y_min, y_max + grid_spacing, grid_spacing)
N_points = 300  # High resolution

# Generate the original grid (shallow copy for reference)
vertical_lines = [(np.full(N_points, x), np.linspace(y_min, y_max, N_points)) for x in x_lines]
horizontal_lines = [(np.linspace(x_min, x_max, N_points), np.full(N_points, y)) for y in y_lines]

# Animation parameters
n_frames = 20  # Fewer frames = faster transition
hold_frames = 15  # Hold final transformation for 2 seconds
frames = []

for i in range(n_frames + hold_frames):
    t = min(i / (n_frames - 1), 1)  # Stops increasing after full transformation

    fig, ax = plt.subplots(figsize=(6,6), dpi=100)  # High resolution output
    ax.set_xlim(-4, 4)  # Keep fixed frame
    ax.set_ylim(-4, 4)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_frame_on(False)  # Remove white border

    # --- Draw the original grid (more visible) ---
    for (x, y) in vertical_lines + horizontal_lines:
        ax.plot(x, y, color='gray', lw=0.8, alpha=0.4)  # Brighter and thicker

    # --- Draw the transformed grid ---
    for (x, y) in vertical_lines:
        X, Y = T(x, y, t)
        ax.plot(X, Y, color='cyan', lw=1.2)

    for (x, y) in horizontal_lines:
        X, Y = T(x, y, t)
        ax.plot(X, Y, color='magenta', lw=1.2)

    # Save frame to memory
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    frames.append(imageio.imread(buf))
    plt.close(fig)

# Save the animation with a 2-second hold at the end
imageio.mimsave('nonlinear_isomorphism.gif', frames, duration=0.08)
