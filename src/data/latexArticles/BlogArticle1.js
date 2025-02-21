import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const { PUBLIC_URL } = process.env; 

const BlogArticle1 = () => {
  return (
    <article style={{ maxWidth: '90%', margin: '0 auto', padding: '20px', lineHeight: '1.6' }}>
      <h1>Introduction</h1>
      <p>
        Hello and welcome to my very first blog article! Today, we're embarking on an exciting journey from the familiar realms of 1D, 2D and 3D spaces into the wondrous world of 4-dimensional space. By the end of this post, you'll not only understand how 4-dimensional numbers—known as quaternions—describe rotations, but you'll also unravel the mystery behind the mesmerizing GIF shown under the title. No advanced prerequisites are needed!
      </p>

      <h2>What is a dimension?</h2>
      <p>A <strong>dimension</strong> is simply the number of independent directions in which you can move:</p>
      <ul>
        <li>
          <strong>1-Dimensional Space (Lineland):</strong><br/>
          Imagine a world that is just a straight line. In Lineland, every point is described by a single number/coordinate (its position on the line).
        </li>
        <li>
          <strong>2-Dimensional Space (Flatland):</strong><br/>
          Now think of a flat sheet of paper. An inhabitant of Flatland can only move left-right or up-down. Each point is given by two coordinates, like <InlineMath math="(x,y)"/>.
        </li>
        <li>
          <strong>3-Dimensional Space (Our universe):</strong><br/>
          This is our everyday world. Here, you can move in three independent directions left-right, up-down, and forward-backward. Each point is specified by three coordinates, for example, <InlineMath math="(x,y,z)"/>.
        </li>
      </ul>
      <p>We call a space with <InlineMath math="n"/> dimensions simply <strong><InlineMath math="n"/>-space</strong>.</p>

      <h2>Symmetries</h2>
      <p>
        A good way to understand "space" is to understand its symmetries. What is a symmetry? 
        We all have an intuitive understanding of the word, but at least I had a very poor idea of what symmetry was until quite recently. For example, consider a square:
      </p>
      <ul>
        <li>
          <strong>Reflection:</strong><br/>
          If you mirror a square across its centerline, the shape looks identical—even though the order of the corners might be reversed.
        </li>
        <li>
          <strong>Rotation:</strong><br/>
          Rotating the square by <InlineMath math="90^\circ"/>, <InlineMath math="180^\circ"/>, or <InlineMath math="270^\circ"/> and of course <InlineMath math="360^\circ"/> also leaves the square unchanged.
        </li>
      </ul>
      <p>
        In general, a <strong>symmetry</strong> is a transformation that does not change the object. But, wait a second, what do we mean exactly by "does not change"? Any numbering of the corners certainly changed through all of the described transformations! The reflection changed something even more fundamental: If you number the corners of the original square clockwise and then mirror it along the axis, the new ordering will be anti-clockwise, meaning we changed the orientation! The answer to what "does not change" means is hence a question of perspective. We get to choose and study symmetry transformations that preserve our favorite structure of the object (like orientation of the square).
      </p>

      <h2>Symmetries of Space</h2>
      <p>
        What do we mean by the symmetries of space? Let’s start by considering the simplest case: the two-dimensional plane, also known as Flatland. The most straightforward transformation we can apply is a <em>translation</em>, shifting the entire plane without changing its shape.
      </p>
      <p>
        But we can also twist or stretch the plane in many different ways.
      </p>
      <div className="image-container">
        <img src={`${PUBLIC_URL}/visuals/nonlinear_isomorphism.gif`} alt="2dRotations" className="gif" />
      </div>
      <p>
        Such transformations drastically alter the appearance of the plane, making it feel unnatural to call them "symmetries." In fact, allowing completely arbitrary transformations seems too general to be useful—there’s little structure to study. So, we impose some restrictions and consider only transformations that:
      </p>
      <ul>
        <li>Fix the origin,</li>
        <li>Preserve straight lines, and</li>
        <li>Keep parallel lines parallel.</li>
      </ul>
      <p>
        This leads us to the realm of <strong>linear transformations</strong>. 
        <div className="image-container">
          <img src={`${PUBLIC_URL}/visuals/linear.gif`} alt="linearTransformations" className="gif" />
        </div>
      </p>
      <p>
        Linear transformations are a vast subject on their own—after all, they form the core of linear algebra! We’ll explore them in more detail in a future post. But for now, let’s go one step further and impose even stricter conditions: we require that our transformations preserve <em>lengths, angles, and orientations</em>. These special transformations are known as <strong>rotations</strong>.
      </p>

      <h2>Rotations in 2D and Infinitesimal Generators</h2>
      <p>
        Rotations in two dimensions are pretty simple because there’s only one plane to rotate in—the plane spanned by the basis vectors <InlineMath math="e_1" /> and <InlineMath math="e_2" />. A rotation is fully described by a single angle <InlineMath math="\theta" />, but there’s a deeper and more elegant way to understand rotations using something called <em>infinitesimal generators</em>. Let’s unpack this step by step.
      </p>

      <h3>What’s an Infinitesimal Generator?</h3>
      <p>
        Imagine you’re rotating a vector in the plane. At every moment, the vector is changing direction, and the rate at which it changes is described by its derivative. The <em>infinitesimal generator</em> is the mathematical object that tells you how the vector is changing at any given point. Specifically, it’s the thing you apply to the current vector to get its derivative.
      </p>
      <p>
        For rotations in 2D, the infinitesimal generator is related to a <InlineMath math="90^\circ" /> rotation. Why <InlineMath math="90^\circ" />? Because rotating by <InlineMath math="90^\circ" /> is like taking a "tiny step" in the direction of rotation. If you keep applying this tiny step over and over, you get a smooth rotation. This is where the connection to the exponential function comes in—more on that in a moment.
      </p>

      <h3>The Wedge Product and Rotation Generators</h3>
      <p>
        To describe this mathematically, we use something called the <em>wedge product</em>, denoted by <InlineMath math="\wedge" />. The wedge product <InlineMath math="e_1 \wedge e_2" /> represents a rotation in the <InlineMath math="e_1" />-<InlineMath math="e_2" /> plane. It has a special property:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="e_1 \wedge e_2 = -e_2 \wedge e_1"/>
      </div>
      <p>
        This means that rotating <InlineMath math="e_1" /> to <InlineMath math="e_2" /> is the opposite of rotating <InlineMath math="e_2" /> to <InlineMath math="e_1" />. In fact, applying <InlineMath math="e_1 \wedge e_2" /> to <InlineMath math="e_1" /> gives <InlineMath math="e_2" />, and applying it to <InlineMath math="e_2" /> gives <InlineMath math="-e_1" />. This is exactly what a <InlineMath math="90^\circ" /> rotation does!
      </p>
      <p>
        If you apply this <InlineMath math="90^\circ" /> rotation twice, you get a <InlineMath math="180^\circ" /> rotation, which is the same as flipping the vector (multiplying it by <InlineMath math="-1" />):
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="(e_1 \wedge e_2)^2 = -1"/>
      </div>
      <p>
        This is a key property that connects rotations to complex numbers and the exponential function.
      </p>

      <h3>From Generators to Rotations: The Exponential Map</h3>
      <p>
        Now, how do we go from this infinitesimal generator to an actual rotation by an angle <InlineMath math="\theta" />? This is where the exponential function comes in. The exponential function is special because it turns "tiny changes" (like the infinitesimal generator) into "full transformations" (like a rotation).
      </p>
      <p>
        If <InlineMath math="g(\theta)" /> represents a rotation by <InlineMath math="\theta" />, its derivative—the rate at which it changes—is given by:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="g'(\theta) = (e_1 \wedge e_2) \, g(\theta)"/>
      </div>
      <p>
        This says that the tangent vector (the direction of change) at any point is just the infinitesimal generator <InlineMath math="e_1 \wedge e_2" /> applied to the current position. To recover the full rotation, we "exponentiate" the generator:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Rotation by } \theta: \quad g(\theta) = \exp\big( (e_1 \wedge e_2) \theta \big)"/>
      </div>
      <p>
        In 2D one can actually quite easily see that an explicit formula is given by:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="g(\theta) = \cos(\theta) + (e_1 \wedge e_2) \sin(\theta)"/>
      </div>
      <p>
        This is exactly the formula for a rotation in 2D! The cosine term handles the <InlineMath math="e_1" />-component, and the sine term handles the <InlineMath math="e_2" />-component.
      </p>
      <p>
        To visualize this, imagine a vector smoothly rotating in the plane. At every step, the infinitesimal generator <InlineMath math="e_1 \wedge e_2" /> is nudging the vector in the direction of rotation. The exponential function "adds up" all these tiny nudges to give you the full rotation.
      </p>

      <div className="image-container">
        <img src={`${PUBLIC_URL}/visuals/2drotation_animation.gif`} alt="2D Rotations" className="gif" />
      </div>

      <p>
        So, in summary: the infinitesimal generator <InlineMath math="e_1 \wedge e_2" /> encodes the idea of a <InlineMath math="90^\circ" /> rotation, and exponentiating it gives you a smooth rotation by any angle <InlineMath math="\theta" />. This is a beautiful connection between algebra (the wedge product) and geometry (rotations) that generalizes to more general symmetries (the infinitesimal generators are kwons as the Lie Algebra of a Lie Group)!
      </p>

      <h2>Rotations in 3D</h2>
      <p>
      In three-dimensional space, rotations become more interesting because there isn’t just one plane to rotate in—there are infinitely many! To describe a rotation in 3D, you need to specify not only the angle <InlineMath math="\theta" /> but also the plane in which the rotation happens. For example, if you choose two orthogonal vectors <InlineMath math="v_1" /> and <InlineMath math="v_2" />, the rotation occurs in the plane they span.

      But how do we describe the infinitesimal generator of this rotation?

      Imagine you have a vector in 3D space. To understand how it rotates in the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane, you first project the vector onto that plane. This projection tells you how much of the vector lies in the plane and is therefore affected by the rotation.

      Rotate the Projection by 90 Degrees: Once you have the projection, the infinitesimal generator is like taking a "tiny step" in the direction of rotation. In 2D, this tiny step is a 90-degree rotation. Similarly, in 3D, the infinitesimal generator rotates the projected vector by 90 degrees within the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane. 

      This infinitesimal generator for the rotation in the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane is denoted by the wedge product <InlineMath math="v_1 \wedge v_2" />. This object encodes the idea of projecting and then rotating by 90 degrees in the plane. When you exponentiate this generator, you get the full rotation by an angle <InlineMath math="\theta" />:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}> <BlockMath math="\text{Rotation in the } v_1\text{-}v_2 \text{ plane by } \theta: \quad \exp\big( (v_1 \wedge v_2) \theta \big) = \cos(\theta) + (v_1 \wedge v_2) \sin(\theta)"/> </div>
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Rotation in the } v_1\text{-}v_2 \text{ plane by } \theta: \quad \exp\big( (v_1 \wedge v_2) \theta \big)"/>
      </div>
      <div className="image-container">
        <img src={`${PUBLIC_URL}/visuals/rotating_sphere.gif`} alt="3D Rotations" className="gif" />
      </div>
      <p>
        Unlike in 2D, where only the origin stays fixed, every rotation in 3D leaves an entire line unchanged—this is called the <em>rotation axis</em>.
      </p>

      <h2>Rotations in 4D</h2>
      <p>
        Now let’s move to four dimensions! In 4D, things get even more fascinating. Just like in 3D, you can rotate a two-dimensional plane, but in 4D, every plane has an entirely orthogonal plane. For example, consider a rotation in the <InlineMath math="e_1" />-<InlineMath math="e_2" /> plane:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math={`
          \\begin{pmatrix}
              x^1 \\\\ x^2 \\\\ x^3 \\\\ x^4
          \\end{pmatrix}
          \\longrightarrow
          \\begin{pmatrix}
            R \\begin{pmatrix} x^1 \\\\ x^2 \\end{pmatrix} \\\\ x^3 \\\\ x^4
          \\end{pmatrix},
        `}/>
      </div>
      <p>
        Here, <InlineMath math="R" /> is the rotation matrix for the <InlineMath math="e_1" />-<InlineMath math="e_2" /> plane. In this case, the entire <InlineMath math="e_3" />-<InlineMath math="e_4" /> plane remains fixed. In 4D, we distinguish between two types of rotations:
      </p>
      <ul>
        <li><strong>Single rotations:</strong> These affect only one plane while leaving the orthogonal plane unchanged.</li>
        <div className="image-container">
          <img src={`${PUBLIC_URL}/visuals/singleTesseract.gif`} alt="Single Rotation in 4D" className="gif" />
        </div>
        <li><strong>Double rotations:</strong> These rotate two mutually orthogonal planes simultaneously.</li>
        <div className="image-container">
          <img src={`${PUBLIC_URL}/visuals/isoclinicTesseract.gif`} alt="Double Rotation in 4D" className="gif" />
        </div>
      </ul>
      <p>
        The animations above show a projection of a cube living in 4D called a <em>tesseract</em>. By projecting it into 3D, we can better visualize its structure. We’ll explore these projections in more detail in the next article. 
      </p>
      <p>
        If the <InlineMath math="v_3" />-<InlineMath math="v_4" /> plane is orthogonal to the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane, a double rotation that rotates the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane by <InlineMath math="\theta_1" /> and the <InlineMath math="v_3" />-<InlineMath math="v_4" /> plane by <InlineMath math="\theta_2" /> is given by:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Double Rotation:} \quad \exp\Big( (v_1 \wedge v_2) \theta_1 + (v_3 \wedge v_4) \theta_2 \Big)"/>
      </div>

      <h2>Isoclinic Rotations</h2>
      <p>
        A special type of double rotation is called an <em>isoclinic rotation</em>. These are rotations where the two orthogonal planes are rotated by the same angle, either in the same direction (left isoclinic) or in opposite directions (right isoclinic). For example:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Left isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 + v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 + v_3 \wedge v_4) \sin(\theta)"/>
      </div>
      <p>
        The double rotation shown in the animation above is a left-isoclinic rotation of the tesseract. Similarly, a <em>right isoclinic rotation</em> rotates the orthogonal plane by the same angle but in the opposite direction:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Right isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 - v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 - v_3 \wedge v_4) \sin(\theta)"/>
      </div>
      <p>
        Combining a left and right isoclinic rotation by the same angle results in a single rotation of one of the planes by <InlineMath math="2\theta" />. This means we can describe any rotation in 4D using combinations of left and right isoclinic rotations.
      </p>

      <h2>Geometry of Isoclinic Rotations</h2>
      <p>
        Isoclinic rotations have a beautiful geometric interpretation. If <InlineMath math="v_1, v_2, v_3, v_4" /> are orthogonal and positively oriented, the generator of a left isoclinic rotation can be written as:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v_1 \wedge v_2 + v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 + e_3 \wedge e_4\big)}_{:=i_L} + b \underbrace{\big( e_1 \wedge e_3 + e_4 \wedge e_2\big)}_{:= j_L} + c \underbrace{\big( e_1 \wedge e_4 + e_2 \wedge e_3 \big)}_{:=k_L}"/>
      </div>
      <p>
        If the vectors <InlineMath math="v_i" /> are unit length, then <InlineMath math="a^2 + b^2 + c^2 = 1" />, meaning the generators of isoclinic rotations correspond to points on a 2-sphere <InlineMath math="S^2 \subset \mathbb{R}^3" />. A general left-isoclinic rotation is obtained by exponentiating the generator:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\exp \big( (a i_L + b j_L + c k_L) \theta \big) = \cos(\theta) + (a i_L + b j_L + c k_L) \sin(\theta)"/>
      </div>
      <p>
        If we think of the scalar part (<InlineMath math="\cos(\theta)" />) and the components <InlineMath math="i_L, j_L, k_L" /> as basis vectors of <InlineMath math="\mathbb{R}^4" />, then left-isoclinic rotations correspond to points on a 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4" />:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\{\text{left-isoclinic rotations} \} = \{ (d, a, b, c) | d^2 + a^2 + b^2 + c^2 = 1\} = S_L^3 \subset \mathbb{R}^4"/>
      </div>
      <p>
        The same is true for right-isoclinic rotations. If <InlineMath math="v_1, v_2, v_3, v_4" /> are orthogonal and positively oriented, a right isoclinic rotation is generated by:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v_1 \wedge v_2 - v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 - e_3 \wedge e_4\big)}_{:=i_R} + b \underbrace{\big( e_1 \wedge e_3 - e_4 \wedge e_2\big)}_{:= j_R} + c \underbrace{\big( e_1 \wedge e_4 - e_2 \wedge e_3 \big)}_{:=k_R}"/>
      </div>
      <p>
        And again:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\{\text{right-isoclinic rotations} \} = \{ (d, a, b, c) | d^2 + a^2 + b^2 + c^2 = 1\} = S_R^3 \subset \mathbb{R}^4"/>
      </div>

      <h2>Quaternions: 4-Dimensional Numbers</h2>
      <p>
        In our exploration of 4D rotations, we’ve stumbled upon a fascinating set of numbers called <em>quaternions</em>. Quaternions are 4-dimensional numbers that support both addition and multiplication. If you’re not interested in the algebraic details, you can skip to the <a href="#LabelA">key relationship</a>.
      </p>
      <p>
        Let’s start by identifying the standard basis for 4D space:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="(e_1, e_2, e_3, e_4) \equiv (1, i, j, k)."/>
      </div>
      <p>
        By studying how left-isoclinic rotations act on these basis elements, we find:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Left-Isoclinic Rotations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{i_L}{\longmapsto}& i, \\ i &\stackrel{i_L}{\longmapsto}& -1, \\ j &\stackrel{i_L}{\longmapsto}& k, \\ k &\stackrel{i_L}{\longmapsto}& -j, \end{array}"/>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{j_L}{\longmapsto}& j, \\ i &\stackrel{j_L}{\longmapsto}& -k, \\ j &\stackrel{j_L}{\longmapsto}& -1, \\ k &\stackrel{j_L}{\longmapsto}& i, \end{array}"/>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{k_L}{\longmapsto}& k, \\ i &\stackrel{k_L}{\longmapsto}& j, \\ j &\stackrel{k_L}{\longmapsto}& -i, \\ k &\stackrel{k_L}{\longmapsto}& -1. \end{array}"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Similarly, right-isoclinic rotations transform the basis as:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Right-Isoclinic Rotations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{i_R}{\longmapsto}& i, \\ i &\stackrel{i_R}{\longmapsto}& -1, \\ j &\stackrel{i_R}{\longmapsto}& -k, \\ k &\stackrel{i_R}{\longmapsto}& j, \end{array}"/>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{j_R}{\longmapsto}& j, \\ i &\stackrel{j_R}{\longmapsto}& k, \\ j &\stackrel{j_R}{\longmapsto}& -1, \\ k &\stackrel{j_R}{\longmapsto}& -i, \end{array}"/>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <BlockMath math="\begin{array}{rcl} 1 &\stackrel{k_R}{\longmapsto}& k, \\ i &\stackrel{k_R}{\longmapsto}& -j, \\ j &\stackrel{k_R}{\longmapsto}& i, \\ k &\stackrel{k_R}{\longmapsto}& -1. \end{array}"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These transformations reveal a key relationship:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
        <BlockMath math="\begin{aligned}
          &i_L(i) = -1 = i_R(i),\quad i_L(j) = -i_R(j),\quad i_L(k) = -i_R(k),\\[1mm]
          &j_L(i) = -j_R(i),\quad j_L(j) = -1 = j_R(j),\quad j_L(k) = -j_R(k),\\[1mm]
          &k_L(i) = -k_R(i),\quad k_L(j) = -k_R(j),\quad k_L(k) = -1 = k_R(k).
        \end{aligned}"/>
      </div>
      <h3 id="LabelA">Key Relationship</h3>
      <p>
        This relationship motivates the idea of interpreting left-isoclinic rotations as <em>left multiplication</em> and right-isoclinic rotations as <em>right multiplication</em> by quaternions. For a quaternion <InlineMath math="v = a + bi + cj + dk" />, this means:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\begin{aligned}
          i_L(v) &= iv,\quad &j_L(v) &= jv,\quad &k_L(v) &= kv,\\[1mm]
          i_R(v) &= vi,\quad &j_R(v) &= vj,\quad &k_R(v) &= vk.
        \end{aligned}"/>
      </div>
      <p>
        These definitions align with the familiar quaternion multiplication rules:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="i^2 = j^2 = k^2 = -1,\quad ij = k = -ji."/>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', margin: '20px 0' }}>
        <h3>Key Takeaway</h3>
        <p>
          Quaternions are 4-dimensional numbers that support both addition and multiplication. Multiplying a quaternion from the left by a unit quaternion (a point on the 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4" />) corresponds to applying a left-isoclinic rotation, while multiplying from the right implements a right-isoclinic rotation.
        </p>
      </div>
      <p>
        In the next post, we’ll explore the geometry of the 3-sphere <InlineMath math="S^3" /> in more detail, including its visualization via stereographic projection and the <em>Hopf fibration</em>.
      </p>
    </article>
  );
};

export default BlogArticle1;
