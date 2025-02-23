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
      <p>We call a space with <InlineMath math="n"/> dimensions simply <strong><InlineMath math="n"/>-space</strong> and denote it <InlineMath math="\mathbb{R}^n"/> because every point in n-space is specified by n real numbers. </p>

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
        This shows that rotations can be described by points on the unit circle <InlineMath math="S^1 \subset \mathbb{R}^2" />.
      </p>
      <p>
        To visualize this, imagine a vector smoothly rotating in the plane. At every step, the infinitesimal generator <InlineMath math="e_1 \wedge e_2" /> is nudging the vector in the direction of rotation. The exponential function "adds up" all these tiny nudges to give you the full rotation.
      </p>

      <div className="image-container">
        <img src={`${PUBLIC_URL}/visuals/2drotation_animation.gif`} alt="2D Rotations" className="gif" />
      </div>

      <p>
        So, in summary: the infinitesimal generator <InlineMath math="e_1 \wedge e_2" /> encodes the idea of a <InlineMath math="90^\circ" /> rotation, and exponentiating it gives you a rotation by any angle <InlineMath math="\theta" />. This is a beautiful connection between algebra (the wedge product) and geometry (rotations) that generalizes to more general symmetries (the infinitesimal generators are kwons as the Lie Algebra of a Lie Group)!
      </p>
      <h3>Complex numbers</h3>
      We have seen that every rotation is described by a point on the unit cicle. We can use this to define multiplication of 2D vectors which then become numbers - complex numbers! 
      <br/>
      If <InlineMath math="v"/> has unit length, ie if <InlineMath math="v = (cos(\theta), sin(\theta)" /> for some angle <InlineMath math="\theta" /> we define multiplcation of w by v from the left:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v \cdot w = exp \big( (e_1 \wedge e_2) \theta \big) w = \big(cos(\theta) + (e_1 \wedge e_2)sin(\theta) \big) w"/>
      </div>
      If <InlineMath math="v"/> does not have unit length, the multiplication also includes a stretch. More concretely, if if <InlineMath math="v = r (cos(\theta), sin(\theta)" />, then
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v \cdot w =r exp \big( (e_1 \wedge e_2) \theta \big)w =r \big(cos(\theta) + (e_1 \wedge e_2)sin(\theta) \big) w"/>
      </div>
      We can define multiplication by the right in the same way. In fact, we can just identify any 2D vector <InlineMath math="(a_1,a_2)"/> with a rotation (plus stretch) <InlineMath math="a_1 + (e_1 \wedge e_2) a_2"/> and use the distributive property to multiply
      two numbers (remember <InlineMath math="(e_1 \wedge e_2)^2 = -1"/>)
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\big(a_1 + (e_1 \wedge e_2)a_2 \big) \big(b_1 + (e_1 \wedge e_2)b_2 \big) = (a_1 b_1 - a_2 b_2) + (e_1 \wedge e_2) (a_1 b_2 + a_2 b_1)  "/>
      </div>
      Which is more conveniently written as:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="r_1 exp\big((e_1 \wedge e_2) \theta_1 \big) r_2 exp\big((e_1 \wedge e_2) \theta_2 \big) = r_1 r_2 exp\big((e_1 \wedge e_2) (\theta_1 + \theta_2) \big)"/>
      </div>
      <p>
      Ramark: f one is only interested in complex numbers, it more common to write i instead of <InlineMath math="e_1 \wedge e_2"/>. Our notation is not only more suggestive of what is happening behind the scenes
      but also generalizes to higher dimensions!
      </p>
      <h2>Rotations in 3D</h2>
      <p>
      In three-dimensional space, rotations become more interesting because there isn’t just one plane to rotate in—there are infinitely many! To describe a rotation in 3D, you need to specify not only the angle <InlineMath math="\theta" /> but also the plane in which the rotation happens. For example, if you choose two orthogonal unit vectors <InlineMath math="v_1" /> and <InlineMath math="v_2" />, the rotation occurs in the plane they span.
      <div className="image-container">
        <img src={`${PUBLIC_URL}/visuals/rotating_sphere.gif`} alt="3D Rotations" className="gif" />
      </div>
      <p>
        Unlike in 2D, where only the origin stays fixed, every rotation in 3D leaves an entire line unchanged—this is called the <em>rotation axis</em>. This is the reason why it is not possible to multiply 3D vectors. 
      </p>
      But how do we describe the infinitesimal generator of this rotation?

      Imagine you have a vector in 3D space. To understand how it rotates in the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane, you first project the vector onto that plane. This projection tells you how much of the vector lies in the plane and is therefore affected by the rotation.

      Rotate the Projection by 90 Degrees: Once you have the projection, the infinitesimal generator is like taking a "tiny step" in the direction of rotation. In 2D, this tiny step is a 90-degree rotation. Similarly, in 3D, the infinitesimal generator rotates the projected vector by 90 degrees within the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane. 

      This infinitesimal generator for the rotation in the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane is denoted by the wedge product <InlineMath math="v_1 \wedge v_2" />. This object encodes the idea of projecting and then rotating by 90 degrees in the plane. When you exponentiate this generator, you get the full rotation by an angle <InlineMath math="\theta" />:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}> 
        <BlockMath math="\text{Rotation in the } v_1\text{-}v_2 \text{ plane by } \theta: \quad \exp\big( (v_1 \wedge v_2) \theta \big)"/> 
      </div>
      Remark: The exponential is in this case not simply equal to <InlineMath math="cos(\theta) + (v_1 \wedge v_2) sin(\theta)"/>. Instead if you decompose a vector w into <InlineMath math="v_1"/>, <InlineMath math="v_2"/> and the third orthogonal component <InlineMath math="w = w_{v_1} + w_{v_2} + w_r"/> the rotation will rotate the <InlineMath math="v_1, v_2"/> component:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}> 
        <BlockMath math="\exp\big( (v_1 \wedge v_2) \theta \big)w = \big( cos(\theta) + (v_1 \wedge v_2) sin(\theta) \big) (w_{v_1} + w_{v_2}) + w_r "/> 
      </div>
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
        The animations above show a projection of a 4D cube called a <em>tesseract</em>. By projecting it into 3D, we can better visualize its structure. We’ll explore these projections in more detail in the next article. 
      </p>
      <p>
        If the <InlineMath math="v_3" />-<InlineMath math="v_4" /> plane is orthogonal to the <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane (and all of them are unit vectors), any rotation will rotate <InlineMath math="v_1" />-<InlineMath math="v_2" /> plane by some angle <InlineMath math="\theta_1" /> and the <InlineMath math="v_3" />-<InlineMath math="v_4" /> plane by some other angle <InlineMath math="\theta_2" />:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{General rotation in 4D:} \quad \exp\Big( (v_1 \wedge v_2) \theta_1 + (v_3 \wedge v_4) \theta_2 \Big)"/>
      </div>
      <p>
        where <InlineMath math="v_i \wedge v_j" /> again denotes a projection into the <InlineMath math="v_i"/>-<InlineMath math="v_j" />-plane followed by <InlineMath math="90 \degree" /> rotation of that plane.
      </p>

      <h2>Isoclinic Rotations</h2>
      <p>
        A special type of double rotation is called an <em>isoclinic rotation</em>. These are rotations where the two orthogonal planes are rotated by the same angle, either in the same direction (left isoclinic) or in opposite directions (right isoclinic). For example:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\text{Left isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 + v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 + v_3 \wedge v_4) \sin(\theta)"/>
      </div>
      The last equality can be seen to be true by decomposing a vector w into its <InlineMath math="v_1, v_2, v_3, v_4" /> components and apply the rotation to its components.
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
        We have seen above that 2D rotations can be represented by points on the unit circle (which is the same as a 1D sphere) <InlineMath math="S^1 \subset \mathbb{R}^2"/>. We will now see that isoclinic rotations can be interpreted as 
        points on the 3D sphere living in 4-space <InlineMath math="S^3 = \{ v=(a,b,c,d) \in \mathbb{R}^4 \big| |v|^2 = a^2+b^2+c^2+d^2 = 1 \} \subset \mathbb{R}^4" />.
        <br />
        If <InlineMath math="v_1, v_2, v_3, v_4" /> are orthogonal and positively oriented, the generator of a left isoclinic rotation can be written as:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v_1 \wedge v_2 + v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 + e_3 \wedge e_4\big)}_{:=i_L} + b \underbrace{\big( e_1 \wedge e_3 + e_4 \wedge e_2\big)}_{:= j_L} + c \underbrace{\big( e_1 \wedge e_4 + e_2 \wedge e_3 \big)}_{:=k_L}"/>
      </div>
      <p>
        If the vectors <InlineMath math="v_i" /> are unit length, then <InlineMath math="a^2 + b^2 + c^2 = 1" />, meaning the generators of isoclinic rotations correspond to points on a 2-sphere <InlineMath math="S^2 = \{ (a,b,c) \in \mathbb{R}^3 \big| a^2 + b^2 +c^2 = 1 \} \subset \mathbb{R}^3" />. A general left-isoclinic rotation is obtained by exponentiating the generator:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\exp \big( (a i_L + b j_L + c k_L) \theta \big) = \cos(\theta) + (a i_L + b j_L + c k_L) \sin(\theta)"/>
      </div>
      <p>
        If we think of the scalar part (<InlineMath math="\cos(\theta)" />) and the components <InlineMath math="i_L, j_L, k_L" /> as basis vectors of 4-space <InlineMath math="\mathbb{R}^4" />, then left-isoclinic rotations correspond to points on a 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4" />:
      </p>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\{\text{left-isoclinic rotations} \} = \{ \big((cos(\theta), sin(\theta)a, sin(\theta)b, sin(\theta) c \big) = (d, \tilde{a}, \tilde{b}, \tilde{c})\in \mathbb{R}^4 \big| d^2 + \tilde{a}^2 + \tilde{b}^2 + \tilde{c}^2 = 1\} = S_L^3 \subset \mathbb{R}^4"/>
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
        <BlockMath math="\exp \big( (a i_R + b j_R + c k_R) \theta \big) = \cos(\theta) + (a i_R + b j_R + c k_R) \sin(\theta)"/>
      </div>
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="\{\text{right-isoclinic rotations} \} = \{ \big((cos(\theta), sin(\theta)a, sin(\theta)b, sin(\theta) c \big) = \{ (d, \tilde{a}, \tilde{b}, \tilde{c}) \in \mathbb{R}^4 \big| d^2 + \tilde{a}^2 + \tilde{b}^2 + \tilde{c}^2 = 1\} = S_R^3 \subset \mathbb{R}^4"/>
      </div>

      <h2>Quaternions: 4-Dimensional Numbers</h2>
      <p>
        Because rotations of 2-space correspond to points on the unit circle, we were able to define left and right multiplication of 2D vectors by just interpreting one vector as a rotation + stretch acting on the other.
        We can now do the same for 4D vectors making them into 4D numbers - called quaternions! 
      <br/>
        If <InlineMath math="v"/> has unit length ie if <InlineMath math="v = (cos(\theta), sin(\theta) a, sin(\theta) b, sin(\theta) c)"/> for an an angle <InlineMath math="\theta"/> and numbers <InlineMath math="a^2 + b^2 + c^2 = 1"/>
        we define left multiplcation by left-isoclinic rotation:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v \cdot w = exp \big( (a i_L + b j_L + c k_L) \theta \big) w = \big( cos(\theta) + (a i_L + bj_L + c k_L) sin(\theta) \big) w"/>
      </div>
      and right-multiplcation by right-isoclinic rotation:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="w \cdot v = exp \big( (a i_R + b j_R + c k_R) \theta \big) w= \big( cos(\theta) + (a i_R + bj_R + c k_R) sin(\theta) \big) w"/>
      </div>
      To get left- and right-multiplications of general 4D vectors, we just add a stretch factor as before. Explicitly for left-multiplication if <InlineMath math="v = r (cos(\theta), sin(\theta) a, sin(\theta) b, sin(\theta) c)"/> we define
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="v \cdot w = r exp \big( (a i_L + b j_L + c k_L) \theta \big) w"/>
      </div> 
      In fact, if we introduce i,j,k that satisfy the multiplication rules:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="i^2 = j^2 = k^2 = -1"/>
        <BlockMath math="ij = k = -ji"/>
      </div>
      and identify <InlineMath math="(e_1, e_2, e_3, e_4) = (1, i, j, k)"/> one can easily check (through simple computation) that:
      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <BlockMath math="i_L(v) = iv, \quad i_R(v) = vi"/>
        <BlockMath math="j_L(v) = jv, \quad j_R(v) = vj"/>
        <BlockMath math="k_L(v) = kv, \quad k_R(v) = vk"/>
      </div>
      and then define the multiplication of 4D numbers by the normal distributive property.
      </p>
      <p> 
        Remark: Unlike multiplication of complex numbers, this multiplication is not commutative!
      </p>
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
