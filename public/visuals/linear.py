import numpy as np
import matplotlib.pyplot as plt
import imageio
import io
from math import acos, degrees

plt.style.use('dark_background')

# Grid parameters
grid_min, grid_max = -25, 25
grid_spacing = 1.0
x_lines = np.arange(grid_min, grid_max + grid_spacing, grid_spacing)
y_lines = np.arange(grid_min, grid_max + grid_spacing, grid_spacing)
N_points = 300
visual_spacing_scale = 2.0

vertical_lines = [(np.full(N_points, x), np.linspace(grid_min, grid_max, N_points)) for x in x_lines]
horizontal_lines = [(np.linspace(grid_min, grid_max, N_points), np.full(N_points, y)) for y in y_lines]

def generate_valid_transformation():
    while True:
        v1 = np.random.uniform(-2, 2, size=2)
        v2 = np.random.uniform(-2, 2, size=2)
        
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        
        if norm_v1 <= 0.6 or norm_v2 <= 0.6:
            continue
        
        cos_theta = np.dot(v1, v2) / (norm_v1 * norm_v2)
        theta = degrees(acos(np.clip(cos_theta, -1, 1)))
        
        if 20 < theta < 160:
            return np.column_stack([v1, v2])

# Animation parameters
n_frames = 20
hold_frames = 15
initial_hold_frames = 5  # Hold at the beginning for 5 frames
frames = []

for _ in range(6):
    A = generate_valid_transformation()
    
    # Hold at the beginning (t = 0)
    for _ in range(initial_hold_frames):
        fig, ax = plt.subplots(figsize=(8, 8), dpi=100)
        ax.set_xlim(-10, 10)
        ax.set_ylim(-10, 10)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_frame_on(False)
        
        # Original grid
        for (x, y) in vertical_lines + horizontal_lines:
            ax.plot(x * visual_spacing_scale, y * visual_spacing_scale, color='gray', lw=0.8, alpha=0.3)
        
        # No transformation applied (t = 0)
        M = np.eye(2)  # Identity matrix
        
        # Draw grid lines
        for lines, color in zip([vertical_lines, horizontal_lines], ['cyan', 'magenta']):
            for (x, y) in lines:
                x_scaled = x * visual_spacing_scale
                y_scaled = y * visual_spacing_scale
                X = M[0,0] * x_scaled + M[0,1] * y_scaled
                Y = M[1,0] * x_scaled + M[1,1] * y_scaled
                ax.plot(X, Y, color=color, lw=1.2)
        
        # Draw basis vectors as arrows
        ax.quiver(0, 0, M[0,0], M[1,0], color='magenta', scale_units='xy', scale=1/visual_spacing_scale, 
                  width=0.005, angles='xy')
        ax.quiver(0, 0, M[0,1], M[1,1], color='cyan', scale_units='xy', scale=1/visual_spacing_scale, 
                  width=0.005, angles='xy')

        # Save frame
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        buf.seek(0)
        frames.append(imageio.imread(buf))
        plt.close(fig)
    
    # Transformation animation
    for i in range(n_frames + hold_frames):
        t = min(i / (n_frames - 1), 1) if i < n_frames else 1
        
        fig, ax = plt.subplots(figsize=(8, 8), dpi=100)
        ax.set_xlim(-10, 10)
        ax.set_ylim(-10, 10)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_frame_on(False)
        
        # Original grid
        for (x, y) in vertical_lines + horizontal_lines:
            ax.plot(x * visual_spacing_scale, y * visual_spacing_scale, color='gray', lw=0.8, alpha=0.3)
        
        # Current transformation
        M = (1 - t) * np.eye(2) + t * A
        
        # Transform and draw grid lines
        for lines, color in zip([vertical_lines, horizontal_lines], ['cyan', 'magenta']):
            for (x, y) in lines:
                x_scaled = x * visual_spacing_scale
                y_scaled = y * visual_spacing_scale
                X = M[0,0] * x_scaled + M[0,1] * y_scaled
                Y = M[1,0] * x_scaled + M[1,1] * y_scaled
                ax.plot(X, Y, color=color, lw=1.2)
        
        # Draw basis vectors as arrows
        ax.quiver(0, 0, M[0,0], M[1,0], color='magenta', scale_units='xy', scale=1/visual_spacing_scale, 
                  width=0.005, angles='xy')
        ax.quiver(0, 0, M[0,1], M[1,1], color='cyan', scale_units='xy', scale=1/visual_spacing_scale, 
                  width=0.005, angles='xy')

        # Save frame
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        buf.seek(0)
        frames.append(imageio.imread(buf))
        plt.close(fig)

# Save looping GIF
imageio.mimsave('linear.gif', frames, duration=0.08)