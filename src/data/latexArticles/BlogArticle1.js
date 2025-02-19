import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const { PUBLIC_URL } = process.env; 

const BlogArticle1 = () => {
  return (
    <article style={{ maxWidth: '90%', margin: '0 auto', padding: '20px', lineHeight: '1.6' }}>
      <h1>Introduction</h1>
      <p>
        Hello and welcome to my very first blog article! Today, we're going on a journey from the familiar 1D and 2D spaces to the wondrous world of 4-dimensional space. By the end of this post, you'll have a taste of how 4-dimensional numbers—known as quaternions—can describe rotations. And don't worry—no advanced prerequisites are needed! <strong>TODO</strong>
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
        This leads us to the realm of <strong>linear transformations</strong>. <strong>TODO: Insert an image of a linear transformation</strong>
      </p>
      <p>
        Linear transformations are a vast subject on their own—after all, they form the core of linear algebra! We’ll explore them in more detail in a future post. But for now, let’s go one step further and impose even stricter conditions: we require that our transformations preserve <em>lengths, angles, and orientations</em>. These special transformations are known as <strong>rotations</strong>.
      </p>

      <h2>Rotations of 2-Space and Infinitesimal Generators</h2>
      <p>
        In two dimensions, rotations are straightforward since every rotation occurs in the single available plane. A rotation is completely determined by a single angle <InlineMath math="\theta"/>. A very elegant way to describe these rotations is via their <em>infinitesimal generators</em>. The generator for rotations in 2D rotates the <InlineMath math="e_1"/>-<InlineMath math="e_2"/>-plane by <InlineMath math="90^\circ"/>, which is the negative of rotating the <InlineMath math="e_2"/>-<InlineMath math="e_1"/>-plane by <InlineMath math="90^\circ"/>:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="e_1 \wedge e_2 = - e_2 \wedge e_1, \quad e_1 \stackrel{e_1 \wedge e_2}{\mapsto} e_2, e_2 \stackrel{e_1 \wedge e_2}{\mapsto} -e_1"/>
        </div>
        Notice that performing a <InlineMath math="90^\circ"/> rotation twice is equivalent to a <InlineMath math="180^\circ"/> rotation, or simply negating the vector:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="(e_1 \wedge e_2)^2 = (e_1 \wedge e_2)(e_1 \wedge e_2) = -1"/>
        </div>
      </p>
      <p>
        To recover an arbitrary rotation from its infinitesimal generator, recall the defining property of the exponential function:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\big(\exp\big( f(\theta) \big)\big)' = f'(\theta) \exp\big( f(\theta) \big)"/>
        </div>
        If <InlineMath math="g(\theta)"/> traces out a rotation by the angle <InlineMath math="\theta"/>, its derivative satisfies
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="g'(\theta) = (e_1 \wedge e_2)\, g(\theta)"/>
        </div>
        That is, the tangent vector to the path is given by applying a <InlineMath math="90^\circ"/> rotation to the current position. Thus, the rotation by <InlineMath math="\theta"/> is given by exponentiating the generator:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\text{Rotation by } \theta: \quad g(\theta) = \exp\big( (e_1 \wedge e_2) \theta \big) = \cos(\theta) + (e_1 \wedge e_2) \sin(\theta)"/>
        </div>
        <div className="image-container">
          <img src={`${PUBLIC_URL}/visuals/2drotation_animation.gif`} alt="2dRotations" className="gif" />
        </div>
      </p>

      <h2>Rotations in 3D</h2>
      <p>
        In three-dimensional space, rotations become more interesting because there is not a unique plane of rotation. In 3D, in addition to the angle <InlineMath math="\theta"/>, one must also specify the plane in which the rotation occurs. For instance, if we choose an orthonormal pair of vectors <InlineMath math="v_1"/> and <InlineMath math="v_2"/>, the infinitesimal generator for the rotation in the plane they span is <InlineMath math="v_1 \wedge v_2"/>. The corresponding rotation is then given by
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\text{Rotation in the } v_1\text{-}v_2 \text{ plane by } \theta: \quad \exp\big( (v_1 \wedge v_2) \theta \big) = \cos(\theta) + (v_1 \wedge v_2) \sin(\theta)"/>
        </div>
        It is worth noting that every rotation in 3D fixes an entire line (the rotation axis), unlike in 2D where only the origin remains fixed.
      </p>

      <h2>Rotations in 4D</h2>
      <p>
        It is time to move to dimension 4! As in 3D, one can rotate a two-dimensional plane; however, in 4D every plane has an entire orthogonal plane. For example, consider a rotation in the <InlineMath math="e_1"/>-<InlineMath math="e_2"/> plane:
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
        where <InlineMath math="R"/> is the rotation of the <InlineMath math="e_1"/>-<InlineMath math="e_2"/> plane. In this case, the entire <InlineMath math="e_3"/>-<InlineMath math="e_4"/> plane remains fixed. More generally, we distinguish between:
      </p>
      <ul>
        <li><strong>Single rotations:</strong> Rotations that affect only one plane while leaving the orthogonal plane unchanged.</li>
        <li><strong>Double rotations:</strong> Rotations where both of two mutually orthogonal planes are rotated simultaneously.</li>
      </ul>
      <p>
        If the <InlineMath math="v_3"/>-<InlineMath math="v_4"/> plane is orthogonal to the <InlineMath math="v_1"/>-<InlineMath math="v_2"/> plane, a double rotation that rotates the <InlineMath math="v_1"/>-<InlineMath math="v_2"/> plane by <InlineMath math="\theta_1"/> and the <InlineMath math="v_3"/>-<InlineMath math="v_4"/> plane by <InlineMath math="\theta_2"/> is given by
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\text{Double Rotation:} \quad \exp\Big( (v_1 \wedge v_2) \theta_1 + (v_3 \wedge v_4) \theta_2 \Big)"/>
        </div>
        <strong>TODO: Insert a GIF demonstrating a rotating sphere in 3D and the concept of double rotations in 4D.</strong>
      </p>

      <h2>Isoclinic Rotations</h2>
      <p>
        A useful way to understand rotations better is by decomposing them into <em>isoclinic rotations</em>. These are double rotations that rotate the orthogonal plane by the same angle up to a sign. A <em>left isoclinic rotation</em> rotates both planes by the same angle:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\text{Left isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 + v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 + v_3 \wedge v_4) \sin(\theta)"/>
        </div>
        Analogously, a <em>right isoclinic rotation</em> rotates the orthogonal plane by the same angle but in the other direction (or equivalently by the negative angle):
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\text{Right isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 - v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 - v_3 \wedge v_4) \sin(\theta)"/>
        </div>
        Note that applying one left isoclinic rotation and one right isoclinic rotation to the same set of (orthogonal) planes by angle <InlineMath math="\theta"/> results in a single rotation of one of the planes by angle <InlineMath math="2\theta"/>. We can thus describe any rotation by a combination of left and right isoclinic rotations.
      </p>

      <h2>Geometry of Isoclinic Rotations</h2>
      <p>
        We can actually understand the geometry of isoclinic rotations! What do I mean by the "geometry of the rotations"? I am claiming that they form a geometric object that you know! Firstly, if <InlineMath math="v_1, v_2, v_3, v_4"/> are orthogonal positively oriented, then <InlineMath math="v_1 \wedge v_2 + v_3 \wedge v_4"/> generates a left isoclinic rotation and can be written as:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="v_1 \wedge v_2 + v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 + e_3 \wedge e_4\big)}_{:=i_L} + b \underbrace{\big( e_1 \wedge e_3 + e_4 \wedge e_2\big)}_{:= j_L} + c \underbrace{\big( e_1 \wedge e_4 + e_2 \wedge e_3 \big)}_{:=k_L}"/>
        </div>
        because those are all the isoclinic rotations made from basis vectors, and we can expand the <InlineMath math="v_i"/>'s in terms of the basis. Further, if <InlineMath math="v_i"/> are all of unit length, then <InlineMath math="a^2 + b^2 + c^2 = 1"/>, and hence isoclinic rotations are generated by points on the 2-sphere <InlineMath math="S^2 \subset \mathbb{R}^3"/>! Now a general left-isoclinic rotation is obtained by exponentiating a generator:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\exp \big( (a i_L + b j_L + c k_L) \theta \big) = \cos(\theta) + (a i_L + b j_L + c k_L) \sin(\theta)"/>
        </div>
        If we regard the scalar part (the <InlineMath math="\cos(\theta)"/> part) and <InlineMath math="i_L, j_L, k_L"/> as basis vectors of <InlineMath math="\mathbb{R}^4"/>, then left-isoclinic rotations are just points on the 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4"/>:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\{\text{left-isoclinic rotations} \} = \{ (d, a, b, c) | d^2 + a^2 + b^2 + c^2 = 1\} = S_L^3 \subset \mathbb{R}^4"/>
        </div>
        The analogue is true for right-isoclinic rotations. If <InlineMath math="v_1, v_2, v_3, v_4"/> are orthogonal positively oriented, then a right isoclinic rotation is generated by
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="v_1 \wedge v_2 - v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 - e_3 \wedge e_4\big)}_{:=i_R} + b \underbrace{\big( e_1 \wedge e_3 - e_4 \wedge e_2\big)}_{:= j_R} + c \underbrace{\big( e_1 \wedge e_4 - e_2 \wedge e_3 \big)}_{:=k_R}"/>
        </div>
        and again
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\{\text{right-isoclinic rotations} \} = \{ (d, a, b, c) | d^2 + a^2 + b^2 + c^2 = 1\} = S_R^3 \subset \mathbb{R}^4"/>
        </div>
      </p>

      <h2>Quaternions: 4-Dimensional Numbers</h2>
      <p>
        In our exploration of rotations in 4-space, we have secretly uncovered a remarkable set of numbers known as <em>quaternions</em>. But what exactly qualifies an object as a number? Beyond supporting addition, a number must also be multiplicative. Quaternions naturally fulfill both roles. If you are not interested in the algebraic details, you can skip to <a href="#LabelA">the key relationship</a>.
      </p>
      <p>
        Let’s begin by identifying the standard basis for 4-space:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="(e_1, e_2, e_3, e_4) \equiv (1, i, j, k)."/>
        </div>
      </p>
      <p>
        By studying the action of left-isoclinic rotations on these basis elements (recall that <InlineMath math="e_i \wedge e_j = -e_j \wedge e_i"/> sends <InlineMath math="e_i"/> to <InlineMath math="e_j"/> and <InlineMath math="e_j"/> to <InlineMath math="-e_i"/>), we find:
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
        An interesting observation is that these left- and right-isoclinic actions are closely related:
      </p>

      <div style={{ margin: '20px 0', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
        <BlockMath math="\begin{aligned}
          &i_L(i) = -1 = i_R(i),\quad i_L(j) = -i_R(j),\quad i_L(k) = -i_R(k),\\[1mm]
          &j_L(i) = -j_R(i),\quad j_L(j) = -1 = j_R(j),\quad j_L(k) = -j_R(k),\\[1mm]
          &k_L(i) = -k_R(i),\quad k_L(j) = -k_R(j),\quad k_L(k) = -1 = k_R(k).
        \end{aligned}"/>
      </div>
      <h3 id="LabelA">Key Relationship</h3>
      <p>
        This relationship motivates our interpretation: we define left-isoclinic rotations as <em>left multiplication</em> and right-isoclinic rotations as <em>right multiplication</em> by quaternions. For a quaternion, a 4-dimensional number,
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="v = a + bi + cj + dk,"/>
        </div>
        this means:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="\begin{aligned}
            i_L(v) &= iv,\quad &j_L(v) &= jv,\quad &k_L(v) &= kv,\\[1mm]
            i_R(v) &= vi,\quad &j_R(v) &= vj,\quad &k_R(v) &= vk.
          \end{aligned}"/>
        </div>
      </p>
      <p>
        These definitions are compatible with the familiar quaternionic multiplication rules:
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <BlockMath math="i^2 = j^2 = k^2 = -1,\quad ij = k = -ji."/>
        </div>
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', margin: '20px 0' }}>
        <h3>Key Takeaway</h3>
        <p>
          Quaternions are 4-dimensional numbers that support both addition and multiplication. Multiplying a quaternion from the left by a unit quaternion (a point on the 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4"/>) corresponds to applying a left-isoclinic rotation, while multiplying from the right implements a right-isoclinic rotation.
        </p>
      </div>
      <p>
        In the next post, we will delve deeper into the geometry of the 3-sphere <InlineMath math="S^3"/>, exploring its visualization via stereographic projection and the <em>Hopf fibration</em>.
      </p>
    </article>
  );
};

export default BlogArticle1;
