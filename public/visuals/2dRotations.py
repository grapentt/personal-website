import matplotlib.pyplot as plt
import numpy as np

# Define theta (let's visualize the rotation at 45 degrees)
theta = np.pi / 4  # 45 degrees

# Unit vector v = (1, 0)
v = np.array([1, 0])

# Rotated vector v' = (cos(theta), sin(theta))
v_rot = np.array([np.cos(theta), np.sin(theta)])

# Plot the original vector and rotated vector
fig, ax = plt.subplots(figsize=(6, 6))

# Plot unit circle
circle = plt.Circle((0, 0), 1, color='gray', fill=False, linestyle='--')
ax.add_artist(circle)

# Plot original vector
ax.quiver(0, 0, v[0], v[1], angles='xy', scale_units='xy', scale=1, color='blue', label="Original vector v")

# Plot rotated vector
ax.quiver(0, 0, v_rot[0], v_rot[1], angles='xy', scale_units='xy', scale=1, color='purple', label=r"Rotated vector")

# Plot cos(theta) component along x-axis
ax.quiver(0, 0, np.cos(theta), 0, angles='xy', scale_units='xy', scale=1, color='red', label=r'$\cos(\theta)v$')

# Plot sin(theta) component along y-axis
ax.quiver(0, 0, 0, np.sin(theta), angles='xy', scale_units='xy', scale=1, color='green', label=r'$\sin(\theta)e_1 \wedge e_2v$')

# Set limits and labels
ax.set_xlim(-1.2, 1.2)
ax.set_ylim(-1.2, 1.2)
ax.set_aspect('equal')
ax.set_xlabel('X')
ax.set_ylabel('Y')

# Add legend
ax.legend()

# Add grid and title
ax.grid(True)
ax.set_title(r'Rotation of Vector $v$ by $\theta$ with Components')

# Show plot
plt.tight_layout()
plt.show()