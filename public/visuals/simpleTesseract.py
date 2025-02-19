import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from itertools import product
import imageio

# Constants for perfect framing
PROJECTION_SCALE = 1.4
AXIS_LIMITS = [-1.25, 1.25]  # 80% of 1.56 max projection

# Generate tesseract vertices
vertices = list(product([-1, 1], repeat=4))
vertices = np.array(vertices, dtype=float)

# Generate edges
edges = []
for i in range(len(vertices)):
    for j in range(i + 1, len(vertices)):
        if np.sum(vertices[i] != vertices[j]) == 1:
            edges.append((i, j))

# 4D isoclinic rotation matrix
def rotation_matrix(theta):
    cos = np.cos(theta)
    sin = np.sin(theta)
    return np.array([
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, cos, -sin],
        [0, 0, sin, cos]
    ])

# Precision projection with safety margins
def project_to_3d(v, d=2.5):
    w, x, y, z = v
    denominator = d - w
    if denominator == 0 or abs(denominator) < 0.1:
        return np.zeros(3)
    return np.array([x, y, z]) * PROJECTION_SCALE / denominator

# Animation parameters
num_frames = 300  # 20 seconds at 15 fps (3 full revolutions)
theta_values = np.linspace(0, 6*np.pi, num_frames)
frames = []

plt.style.context('dark_background')

for idx, theta in enumerate(theta_values):
    # Rotate vertices
    rot_mat = rotation_matrix(theta)
    rotated = np.array([rot_mat @ v for v in vertices])
    
    # Project to 3D
    projected = np.array([project_to_3d(v) for v in rotated])
    
    # Create optimized plot
    fig = plt.figure(figsize=(7, 7), facecolor='black')  # Smaller figure size
    ax = fig.add_subplot(111, projection='3d', facecolor='black')
    ax.set_axis_off()
    
    # Fixed camera perspective
    ax.view_init(elev=25, azim=45)
    
    # Set strict axis limits
    ax.set_xlim(AXIS_LIMITS)
    ax.set_ylim(AXIS_LIMITS)
    ax.set_zlim(AXIS_LIMITS)
    
    # Plot crisp edges
    for edge in edges:
        p1, p2 = projected[edge[0]], projected[edge[1]]
        ax.plot(*zip(p1, p2), 
                color=(0.3, 0.7, 1.0),  # Ice blue
                lw=3.2,
                alpha=0.95,
                solid_capstyle='round')

    # Convert to image
    fig.canvas.draw()
    img = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
    img = img.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    frames.append(img)
    plt.close()

# Save with optimized settings
imageio.mimsave('simple_tesseract.gif', frames, fps=15, loop=2)