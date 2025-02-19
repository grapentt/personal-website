import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from itertools import product
import imageio

# Constants for perfect framing
PROJECTION_SCALE = 1.4
AXIS_LIMITS = [-1.25, 1.25]

# Generate tesseract vertices and edges
vertices = np.array(list(product([-1, 1], repeat=4)), dtype=float)
edges = [(i,j) for i in range(len(vertices)) for j in range(i+1,len(vertices)) 
        if np.sum(vertices[i] != vertices[j]) == 1]

# Enhanced rotation matrix with smooth motion
def rotation_matrix(theta):
    cos = np.cos(theta)
    sin = np.sin(theta)
    return np.array([
        [cos, -sin, 0.1*sin, 0],
        [sin, cos, 0, 0],
        [0, 0, cos, -sin],
        [0.1*sin, 0, sin, cos]
    ])

# Project 4D vertices to 3D
def project_to_3d(v, d=2.5):
    w, x, y, z = v
    denominator = d - w
    if denominator == 0 or abs(denominator) < 0.1:
        return np.zeros(3)
    return np.array([x, y, z]) * PROJECTION_SCALE / denominator

# Parametric cylinder generation for rod-like edges
def create_cylinder(p1, p2, radius=0.03, num_points=20):
    vec = p2 - p1
    length = np.linalg.norm(vec)
    if length < 1e-6:
        return None
    vec = vec / length
    
    # Create circular basis
    theta = np.linspace(0, 2*np.pi, num_points)
    z = np.linspace(0, length, num_points)
    theta, z = np.meshgrid(theta, z)
    
    # Calculate cylinder coordinates
    x = radius * np.cos(theta)
    y = radius * np.sin(theta)
    
    # Find orthogonal basis vectors
    if np.allclose(vec, [0,0,1]):
        basis1 = np.array([1,0,0])
        basis2 = np.array([0,1,0])
    else:
        basis1 = np.cross(vec, [0,0,1])
        basis1 /= np.linalg.norm(basis1)
        basis2 = np.cross(vec, basis1)
    
    # Transform coordinates
    xyz = np.zeros((3, *x.shape))
    xyz[0] = p1[0] + x*basis1[0] + y*basis2[0] + z*vec[0]
    xyz[1] = p1[1] + x*basis1[1] + y*basis2[1] + z*vec[1]
    xyz[2] = p1[2] + x*basis1[2] + y*basis2[2] + z*vec[2]
    
    return xyz

# Animation parameters
num_frames = 180  # 12 seconds at 15 fps
theta_values = np.linspace(0, 4*np.pi, num_frames)
frames = []

plt.style.use('dark_background')

print("Generating frames...")
for idx, theta in enumerate(theta_values):
    if idx % 10 == 0:
        print(f"Processing frame {idx}/{num_frames}")
        
    fig = plt.figure(figsize=(8, 8), facecolor='black')
    ax = fig.add_subplot(111, projection='3d', facecolor='black')
    ax.set_axis_off()
    
    # Set view perspective
    ax.view_init(elev=22, azim=-45)
    ax.set_xlim(AXIS_LIMITS)
    ax.set_ylim(AXIS_LIMITS)
    ax.set_zlim(AXIS_LIMITS)
    ax.set_box_aspect([1,1,1])
    
    # Rotate and project vertices
    rot_mat = rotation_matrix(theta)
    rotated = np.array([rot_mat @ v for v in vertices])
    projected = np.array([project_to_3d(v) for v in rotated])
    
    # Plot enhanced edges
    for edge in edges:
        p1, p2 = projected[edge[0]], projected[edge[1]]
        
        # Create cylindrical rod
        cylinder = create_cylinder(p1, p2)
        if cylinder is not None:
            X, Y, Z = cylinder
            
            # Use a color gradient based on Z coordinate
            colors = plt.cm.cool((Z - Z.min()) / (Z.max() - Z.min() + 1e-6))
            
            ax.plot_surface(X, Y, Z, rstride=1, cstride=1, 
                           facecolors=colors,
                           linewidth=0, antialiased=True, alpha=0.9)

    # Add subtle ambient glow
    ax.plot([], [], [], ' ', alpha=0.3, 
           ms=50, markeredgecolor='none', color='cyan')
    
    # Convert to image
    fig.canvas.draw()
    # Get the RGBA buffer from the figure
    w, h = fig.canvas.get_width_height()
    buf = np.fromstring(fig.canvas.tostring_argb(), dtype=np.uint8)
    buf.shape = (w, h, 4)
    
    # Convert ARGB to RGB
    buf = buf[:, :, [1,2,3]]
    frames.append(buf)
    plt.close()

print("Saving GIF...")
# Save GIF with basic parameters
imageio.mimsave('tesseract.gif', frames, fps=15)
print("Done!")