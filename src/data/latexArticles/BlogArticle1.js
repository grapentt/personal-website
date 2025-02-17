import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const BlogArticle1 = () => (
  <article style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', lineHeight: '1.6' }}>
    <p>
      Hello and welcome to my first ever blog article! The goal of this first article is to exhibit some structure of 4-dimensional space and does not require any prerequisites! By the end, you will know how 4-dimensional numbers—called quaternions—work. <strong>TODO</strong>
    </p>

    <h2>What are dimensions?</h2>
    <p>
      The dimension is just the number of orthogonal directions that an inhabitant living in the space can move in. 
      2-dimensional space is flatland. An inhabitant of flatland can only walk in 2 directions: left-right and up-down. 
      Imagine a creature without any height living on a piece of paper that extends indefinitely in the two directions. 
      Every point in that 2-dimensional space can be described by two numbers—<i>2 coordinates</i>.
    </p>
    <p>
      1-dimensional space is lineland. There is only one direction that a linelander can move in. 
      Every point in lineland is described by one number—<i>1 coordinate</i>.
    </p>
    <p>
      3-dimensional space is the most familiar to us as it (appears to be) the dimension of the physical space we inhabit. 
      Every point in 3-dimensional space can be described by three numbers (think: x, y, z)—<i>3 coordinates</i>.
    </p>
    <p>
      We will call n-dimensional space <i>n-space</i>.
    </p>

    <h2>Symmetries</h2>
    <p>
      A good way to understand "space" is to understand its symmetries. What is a symmetry? 
      We all have an intuitive understanding of the word, but at least I had a very poor idea of what symmetry was. 
      From school, I knew that a square, for example, has a few symmetries: 
      I can, for example, draw an axis through the middle and mirror it along that axis <i>without changing the object</i> 
      (it looks the exact same). Another symmetry I learned of was that I can rotate the square by <InlineMath math="90^\circ, 180^\circ, 270^\circ"/> 
      and <InlineMath math="360^\circ"/> <i>without changing the object</i>. As one might guess by now, the key point is that the 
      object does not change through these <i>symmetry transformations</i>. A rotation by only <InlineMath math="45^\circ"/> 
      for example will change the object; it is thus not a symmetry of the square.
    </p>
    <p>
      In more general terms, a symmetry of an object is a transformation (like a rotation or mirroring) that does not change the object. 
      But, wait a second, what do we mean exactly by "does not change"? Any numbering of the corners certainly changed through all of the described transformations! 
      The mirroring along an axis changed something even more fundamental: If you number the corners of the original square clockwise and then mirror it along the axis, 
      the new ordering will be anti-clockwise, meaning we changed the orientation!
    </p>
    <p>
      The answer to what "does not change" means is hence a question of perspective. We get to choose and study symmetry transformations that preserve our favorite structure of the object (like orientation or the square).
    </p>

    <h2>Symmetries of Space</h2>
    <p>
      Applying this to space, what are the transformations of space that do not change it? Let's think of 2-space (flatland) first. 
      We can, of course, shift the entire plane around. This is called a <i>translation</i>. Another thing we can do is stretch and distort the plane. 
      And there are many ways in which one can do that! <strong>TODO: image of random non-linear transformation</strong>
    </p>
    <p>
      The transformed plane looks quite different! It feels wrong to consider such a transformation a symmetry, and such general symmetries seem intractable and do not give us much insight. 
      So, we restrict ourselves to symmetries that:
    </p>
    <ul>
      <li>Fix the origin</li>
      <li>Leave straight lines straight, and</li>
      <li>Parallel lines parallel.</li>
    </ul>
    <p>
      That is, we consider only linear transformations. <strong>TODO: Image of linear transformation</strong>
    </p>
    <p>
      There is a lot to say about them—after all, they are the main study of linear algebra. We will get to them in a post not so far away in the future, 
      but for now, we want to restrict the symmetries even further: We want <i>lengths, angles, and orientations</i> to be preserved. 
      These symmetry transformations are known as <i>rotations</i>.
    </p>

    <h2>Rotations of Space</h2>
    <p>
      In <i>2 dimensions</i>, rotations are a bit boring. Every rotation is specified by just one angle, as there is only one plane to rotate. 
      Yet, this is a good point to introduce some notation. Let us denote a rotation of <InlineMath math="90^\circ"/> around this one plane spanned by <InlineMath math="e_1"/> and <InlineMath math="e_2"/> by <InlineMath math="e_1 \wedge e_2"/>. 
      We call this the <i>infinitesimal generator</i> of rotations of this plane. Since a rotation around the plane spanned by <InlineMath math="e_2"/>-<InlineMath math="e_1"/> is just a negative rotation of the <InlineMath math="e_1"/>-<InlineMath math="e_2"/>-plane, we define:
      <BlockMath math="e_1 \wedge e_2 = - e_2 \wedge e_1"/>
      Also, note that rotating by <InlineMath math="90^\circ"/> twice is the same as rotating by <InlineMath math="180^\circ"/> or negating:
      <BlockMath math="(e_1 \wedge e_2)^2 = (e_1 \wedge e_2)(e_1 \wedge e_2) = -1"/>
    </p>
    <p>
      To get from infinitesimal generators of rotations to rotations, we need to recall that the defining property of the exponential function <InlineMath math="\exp"/> is:
      <BlockMath math="\bigg(\exp\big(f(\theta)\big)\bigg)' = f'(\theta) \exp\big(f(\theta)\big)"/>
      If <InlineMath math="g(\theta)"/> traces out a circle/a rotation by <InlineMath math="\theta"/>, then <InlineMath math="g'(\theta) = (e_1 \wedge e_2) g(\theta) = \big( (e_1 \wedge e_2) \theta \big)' g(\theta)"/> is always a <InlineMath math="90^\circ"/> rotation of the current point. 
      Hence, a rotation by <InlineMath math="\theta"/> is given by exponentiating the infinitesimal generator times <InlineMath math="\theta"/>!
      <BlockMath math="\text{Rotation by } \theta = g(\theta) =  \exp\big( (e_1 \wedge e_2) \theta \big)  = \cos(\theta) + (e_1 \wedge e_2) \sin(\theta)"/>
    </p>
    <p>
      <strong>TODO: python gif showing <InlineMath math="v"/> and <InlineMath math="e_1 \wedge e_2 v"/> which is perpendicular, generating the rotation</strong>
    </p>

    <h2>Rotations of 3-Dimensional Space</h2>
    <p>
      Let's think about rotations of <i>3-dimensional space</i>. There is more than just one plane that we can rotate in. 
      Additionally to the angle, we have to specify this plane. <strong>TODO: insert gif of rotating sphere</strong>
    </p>
    <p>
      We can again denote a rotation of <InlineMath math="90^\circ"/> of the plane spanned by <InlineMath math="v_1"/> and <InlineMath math="v_2"/> by <InlineMath math="v_1 \wedge v_2"/> (let's take them to be orthogonal and of unit length) and then describe a rotation by:
      <BlockMath math="\text{Rotation of plane spanned by } v_1 \text{ and } v_2 \text{ by } \theta = \exp\big( (v_1 \wedge v_2) \theta \big) = \cos(\theta) + (v_1 \wedge v_2) \sin(\theta)"/>
      Note that every rotation fixes an entire line, whereas in 2 dimensions, every rotation only fixes the origin.
    </p>

    <h2>Rotations of 4-Dimensional Space</h2>
    <p>
      It's time to move to <i>dimension 4</i>! Here, again, you can choose a 2-plane spanned by <InlineMath math="v_1"/> and <InlineMath math="v_2"/> and specify an angle by which you want to rotate. 
      For simplicity, consider a rotation <InlineMath math="R"/> of the <InlineMath math="e_1 \wedge e_2"/> plane:
      <BlockMath math={`
        \\begin{pmatrix}
            x^1 \\\\ x^2 \\\\ x^3 \\\\ x^4
        \\end{pmatrix}  \\rightarrow  
        \\begin{pmatrix}
           R \\begin{pmatrix} x^1 \\\\ x^2 \\end{pmatrix} \\\\ \\hspace{0.4cm} x^3 \\\\ \\hspace{0.4cm}x^4
        \\end{pmatrix}
      `}/>
      There is an entire plane, the <InlineMath math="e_3"/>-<InlineMath math="e_4"/> plane, that remains fixed! Note that in 4 dimensions, every vector has three vectors that are orthogonal to it, and every plane has an entire plane that is orthogonal to it. 
      The orthogonal plane to the <InlineMath math="e_1"/>-<InlineMath math="e_2"/>-plane is the <InlineMath math="e_3"/>-<InlineMath math="e_4"/>-plane and is getting fixed by the rotation described above.
    </p>
    <p>
      We call a rotation that only rotates one plane and fixes the orthogonal plane a <strong>single rotation</strong>. 
      Rotating the other orthogonal plane as well is another valid rotation of 4-space. We call such a rotation a <strong>double rotation</strong>.
    </p>
    <p>
      Hence, if the <InlineMath math="v_3"/>-<InlineMath math="v_4"/>-plane is orthogonal to the <InlineMath math="v_1"/>-<InlineMath math="v_2"/>-plane, any double rotation is described by:
      <BlockMath math="\text{Rotation of } v_1\text{-}v_2\text{-plane by } \theta_1 \text{ and } v_3\text{-}v_4\text{-plane by } \theta_2 = \exp\big( (v_1 \wedge v_2) \theta_1 + (v_3 \wedge v_4) \theta_2 \big)"/>
    </p>

    <h2>Isoclinic Rotations</h2>
    <p>
      A useful way to understand rotations better is by decomposing them into <i>isoclinic rotations</i>. These are double rotations that rotate the orthogonal plane by the same angle up to a sign. 
      A <i>left isoclinic rotation</i> rotates both planes by the same angle:
      <BlockMath math="\text{Left isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 + v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 + v_3 \wedge v_4) \sin(\theta)"/>
      Analogously, a <i>right isoclinic rotation</i> rotates the orthogonal plane by the same angle but in the other direction (or equivalently by the negative angle):
      <BlockMath math="\text{Right isoclinic double rotation by } \theta = \exp\big( (v_1 \wedge v_2 - v_3 \wedge v_4) \theta \big) = \cos(\theta) + (v_1 \wedge v_2 - v_3 \wedge v_4) \sin(\theta)"/>
      Note that applying one left isoclinic rotation and one right isoclinic rotation to the same set of (orthogonal) planes by angle <InlineMath math="\theta"/> results in a single rotation of one of the planes by angle <InlineMath math="2\theta"/>. 
      We can thus describe any rotation by a combination of left and right isoclinic rotations.
    </p>

    <h2>Geometry of Isoclinic Rotations</h2>
    <p>
      We can actually understand the geometry of isoclinic rotations quite easily! What do I mean by the "geometry of the rotations"? 
      I am claiming that they form a geometric object that you know! Firstly, if <InlineMath math="v_1, v_2, v_3, v_4"/> are orthogonal and <InlineMath math="v_1 \wedge v_2 + v_3 \wedge v_4"/> generates a left isoclinic rotation, then:
      <BlockMath math="v_1 \wedge v_2 + v_3 \wedge v_4 = a \underbrace{\big( e_1 \wedge e_2 + e_3 \wedge e_4\big)}_{:=i_L} + b \underbrace{\big( e_1 \wedge e_3 + e_4 \wedge e_2\big)}_{:= j_L} + c \underbrace{\big( e_1 \wedge e_4 + e_2 \wedge e_3 \big)}_{:=k_L}"/>
      because those are all the isoclinic rotations made from basis vectors, and we can expand the <InlineMath math="v_i"/>'s in terms of the basis. 
      Further, if <InlineMath math="v_i"/> are all of unit length, then <InlineMath math="a^2 + b^2 + c^2 = 1"/>, and hence isoclinic rotations are generated by points on the 2-sphere <InlineMath math="S^2 \subset \mathbb{R}^3"/>! 
      Now, a general left-isoclinic rotation is obtained by exponentiating a generator:
      <BlockMath math="\exp \big( (a i_L + b j_L + c k_L) \theta \big) = \cos(\theta) + (a i_L + b j_L + c k_L) \sin(\theta)"/>
      If we regard the scalar part (the <InlineMath math="\cos(\theta)"/> part) and <InlineMath math="i_L, j_L, k_L"/> as basis vectors of <InlineMath math="\mathbb{R}^4"/>, then left-isoclinic rotations are just points on the 3-sphere <InlineMath math="S^3 \subset \mathbb{R}^4"/>!
      <BlockMath math="\{\text{left-isoclinic rotations} \} = \{ (d, a, b, c) | d^2 + a^2 + b^2 + c^2 = 1\} = S^3 \subset \mathbb{R}^4"/>
    </p>
  </article>
);

export default BlogArticle1;