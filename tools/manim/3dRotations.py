import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D  # needed for 3D plotting
import imageio
import io

# --- Helper Function: Rotate Points About an Axis ---
def rotate_points(points, axis, theta):
    """
    Rotate an array of 3D points about a given axis by angle theta (in radians)
    using Rodrigues' rotation formula.
    """
    axis = axis / np.linalg.norm(axis)
    cos_theta = np.cos(theta)
    sin_theta = np.sin(theta)
    rotated = (points * cos_theta +
               np.cross(axis, points) * sin_theta +
               np.outer(np.dot(points, axis), axis) * (1 - cos_theta))
    return rotated

# --- Helper Function: Compute the Great Circle and Plane Basis ---
def compute_great_circle(normal, num_points=100):
    """
    Given a plane through the origin (with unit normal 'normal'),
    compute the great circle (its intersection with the unit sphere)
    and return an orthonormal basis (v, w) for the plane.
    """
    normal = normal / np.linalg.norm(normal)
    # Choose a vector orthogonal to normal.
    if np.allclose(normal, [0, 0, 1]) or np.allclose(normal, [0, 0, -1]):
        v = np.array([1, 0, 0])
    else:
        v = np.cross(normal, [0, 0, 1])
        v = v / np.linalg.norm(v)
    # Compute w so that (v, w, normal) is right-handed:
    w = np.cross(normal, v)
    t = np.linspace(0, 2 * np.pi, num_points)
    circle = np.outer(np.cos(t), v) + np.outer(np.sin(t), w)
    return circle, v, w

# --- Create the Sphere Mesh with Higher Resolution ---
phi = np.linspace(0, np.pi, 50)      # polar angle
theta = np.linspace(0, 2 * np.pi, 50)  # azimuthal angle
phi, theta = np.meshgrid(phi, theta)
X = np.sin(phi) * np.cos(theta)
Y = np.sin(phi) * np.sin(theta)
Z = np.cos(phi)

# Flatten the mesh into a list of points (each row is a point in ℝ³)
sphere_points = np.column_stack([X.flatten(), Y.flatten(), Z.flatten()])

# --- Animation Parameters ---
fps = 20
pause_frames = int(0.5 * fps)      # half-second pause (e.g., 10 frames)
rotate_frames = int(2.0 * fps)     # 2-second rotation (e.g., 40 frames)
post_pause_frames = int(0.5 * fps) # another half-second pause
cycle_frames = pause_frames + rotate_frames + post_pause_frames
num_cycles = 5                   # total number of cycles
total_frames = num_cycles * cycle_frames

frames = []  # List to store images for the GIF

# We'll update the sphere's orientation cumulatively.
current_sphere = sphere_points.copy()

# --- Animation Loop ---
for frame in range(total_frames):
    cycle = frame // cycle_frames
    subframe = frame % cycle_frames

    # At the start of a new cycle, choose a new random plane.
    if subframe == 0:
        # Store the sphere's orientation at the beginning of this cycle.
        sphere_baseline = current_sphere.copy()
        # Choose a random direction (plane normal).
        random_vec = np.random.randn(3)
        current_plane = random_vec / np.linalg.norm(random_vec)
        # Compute the great circle and an orthonormal basis (v, w) for the plane.
        circle, v, w = compute_great_circle(current_plane)
    
    # Determine the rotation angle and whether to show the plane.
    if subframe < pause_frames:
        # Initial pause: show the plane but no rotation.
        angle = 0
        show_plane = True
    elif subframe < pause_frames + rotate_frames:
        # During rotation: interpolate angle from 0 to 2π.
        t_rot = (subframe - pause_frames) / rotate_frames
        angle = 2 * np.pi * t_rot
        show_plane = True
    else:
        # Post-rotation pause: full rotation has been applied; hide the plane.
        angle = 2 * np.pi
        show_plane = False

    # Rotate the sphere (from the baseline) by the computed angle about the chosen axis.
    rotated = rotate_points(sphere_baseline, current_plane, angle)
    current_sphere = rotated  # update the sphere's orientation

    # Reshape the rotated points to match the original sphere mesh.
    Xr = rotated[:, 0].reshape(X.shape)
    Yr = rotated[:, 1].reshape(Y.shape)
    Zr = rotated[:, 2].reshape(Z.shape)

    # --- Plotting ---
    fig = plt.figure(figsize=(6, 6))
    ax = fig.add_subplot(111, projection='3d')
    
    # Plot the sphere surface without gridlines or extra mesh artifacts.
    ax.plot_surface(Xr, Yr, Zr, color='cyan', alpha=0.6, edgecolor='none')
    
    if show_plane:
        # --- Plot a Translucent Patch Representing the Entire Plane ---
        grid_range = np.linspace(-1.5, 1.5, 10)
        U, V = np.meshgrid(grid_range, grid_range)
        plane_X = U * v[0] + V * w[0]
        plane_Y = U * v[1] + V * w[1]
        plane_Z = U * v[2] + V * w[2]
        ax.plot_surface(plane_X, plane_Y, plane_Z, color='blue', alpha=0.2, zorder=0)

        # --- Draw the Great Circle in Two Parts ---
        # Covered arc: from 0 to the current angle.
        if angle > 0:
            t_covered = np.linspace(0, angle, 200)
            circle_covered = np.outer(np.cos(t_covered), v) + np.outer(np.sin(t_covered), w)
            ax.plot(circle_covered[:, 0], circle_covered[:, 1], circle_covered[:, 2],
                    color='red', linewidth=3, zorder=5)
        # Remaining arc: from the current angle to 2π.
        if angle < 2 * np.pi:
            t_remaining = np.linspace(angle, 2 * np.pi, 200)
            circle_remaining = np.outer(np.cos(t_remaining), v) + np.outer(np.sin(t_remaining), w)
            ax.plot(circle_remaining[:, 0], circle_remaining[:, 1], circle_remaining[:, 2],
                    color='salmon', linewidth=2, linestyle='--', zorder=4)

        # --- Annotate the Angle ---
        # Place the text slightly offset from the point on the circle at the current angle.
        text_pos = (np.cos(angle) * v + np.sin(angle) * w) * 1.1
        angle_deg = np.degrees(angle)
        ax.text(text_pos[0], text_pos[1], text_pos[2],
                f"{angle_deg:.0f}°", color='black', fontsize=12, zorder=11)
    
    # Set limits and aspect ratio for a nicely scaled view.
    ax.set_xlim([-1.2, 1.2])
    ax.set_ylim([-1.2, 1.2])
    ax.set_zlim([-1.2, 1.2])
    ax.set_box_aspect([1, 1, 1])
    
    # Remove axes and grid for a clean look.
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_zticks([])
    ax.set_axis_off()
    ax.grid(False)
    
    # Use a fixed viewing angle.
    ax.view_init(elev=30, azim=30)
    
    # Save the frame to an in-memory buffer.
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    image = imageio.imread(buf)
    frames.append(image)
    buf.close()
    plt.close(fig)

# --- Save the GIF ---
gif_filename = 'rotating_sphere.gif'
imageio.mimsave(gif_filename, frames, fps=fps)
print(f"GIF saved as {gif_filename}")
