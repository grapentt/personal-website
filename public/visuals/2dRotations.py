import numpy as np
import matplotlib.pyplot as plt
import imageio
import io

# Use a dark background style for a mysterious look.
plt.style.use('dark_background')

# Animation parameters
n_frames_rotation = 30      # Number of frames for the rotation phase
n_frames_hold = 30          # Hold frames at the final angle (~2 sec if duration=0.1 sec/frame)
theta_final_deg = 65        # Final rotation angle in degrees
theta_final = np.deg2rad(theta_final_deg)

frames = []  # List to hold each frame image

for i in range(n_frames_rotation + n_frames_hold):
    # Interpolate theta during rotation; hold at theta_final afterward.
    if i < n_frames_rotation:
        theta = theta_final * i / (n_frames_rotation - 1)
        show_decomp = False
    else:
        theta = theta_final
        show_decomp = True

    # Create a new figure with fixed size and axes that never change.
    fig, ax = plt.subplots(figsize=(6,6))
    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal', adjustable='box')
    
    # Draw fixed reference axes.
    ax.axhline(0, color='white', lw=1, linestyle='--', zorder=0)
    ax.axvline(0, color='white', lw=1, linestyle='--', zorder=0)
    
    # Create and add a new unit circle for this frame.
    circle = plt.Circle((0, 0), 1, edgecolor='w', facecolor='none', lw=1, ls='dotted', alpha=0.3)
    ax.add_artist(circle)
    
    # --- Draw the traced arc of the unit circle ---
    # This shows how the tip of v is tracing an arc from 0 to theta.
    arc_t = np.linspace(0, theta, 100)
    arc_x = np.cos(arc_t)
    arc_y = np.sin(arc_t)
    ax.plot(arc_x, arc_y, color='c', lw=2, zorder=1)  # cyan arc
    
    # --- Draw the rotating vector v ---
    # v = (cos(theta), sin(theta))
    v_rot = np.array([np.cos(theta), np.sin(theta)])
    ax.arrow(0, 0, v_rot[0], v_rot[1],
             head_width=0.05, head_length=0.08, fc='magenta', ec='magenta',
             length_includes_head=True, zorder=2)
    # Label the vector simply as v
    ax.text(v_rot[0] + 0.08, v_rot[1] + 0.08, r'$v$', color='magenta', fontsize=14)
    
    # --- Draw the attached perpendicular vector (e_1 \wedge e_2) v ---
    # Compute the 90° rotation: (-sin(theta), cos(theta))
    v_perp = np.array([-np.sin(theta), np.cos(theta)])
    # Draw the arrow starting at the tip of v
    start = v_rot
    ax.arrow(start[0], start[1], v_perp[0], v_perp[1],
             head_width=0.05, head_length=0.08, fc='lime', ec='lime',
             length_includes_head=True, zorder=2)
    # Label the perpendicular vector
    end = start + v_perp
    ax.text(end[0] + 0.08, end[1] + 0.08, r'$(e_1 \wedge e_2)v$', color='lime', fontsize=14)
    
    # --- Final frame: Show decomposition of v ---
    if show_decomp:
        # Draw dashed lines for the components:
        # Horizontal component: from (0,0) to (v_rot[0],0)
        ax.plot([0, v_rot[0]], [0, 0], color='magenta', lw=1.5, ls='--', zorder=1)
        # Vertical component: from (v_rot[0],0) to (v_rot[0], v_rot[1])
        ax.plot([v_rot[0], v_rot[0]], [0, v_rot[1]], color='magenta', lw=1.5, ls='--', zorder=1)
        
        # Label the horizontal component as cos(theta)v₀ (with v₀ = (1,0))
        mid_horiz = (v_rot[0] / 2, 0)
        ax.text(mid_horiz[0], mid_horiz[1] - 0.15, r'$\cos(\theta)v_0$', 
                color='magenta', fontsize=12, ha='center')
        # Label the vertical component as sin(theta)(e_1 \wedge e_2)v
        mid_vert = (v_rot[0], v_rot[1] / 2)
        ax.text(mid_vert[0] + 0.15, mid_vert[1], r'$\sin(\theta)(e_1 \wedge e_2)v_0$', 
                color='magenta', fontsize=12, va='center')
        # Display the final expression as an equation.
        ax.text(0, -1.3, r'$\exp((e_1 \wedge e_2)\theta)v = cos(\theta) v  + sin(\theta) (e_1 \wedge e_2) v$', color='w', fontsize=16, ha='center')
    
    # Remove axis ticks for a cleaner look.
    ax.set_xticks([])
    ax.set_yticks([])
    
    # Save the frame into a buffer (without bbox_inches='tight' to keep the view fixed)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    frame_image = imageio.imread(buf)
    frames.append(frame_image)
    plt.close(fig)

# Save all frames as an animated GIF (each frame ~0.1 sec)
imageio.mimsave('rotation_animation.gif', frames, duration=0.1)
