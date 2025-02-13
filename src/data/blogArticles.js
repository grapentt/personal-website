// TODO Add a couple lines about each project
const data = [
  {
    title: 'Quaternions and more: A first glimpse into the fourth dimenion',
    subtitle: '2015 BVP Hackathon',
    image: '/images/projects/nearestdollar.jpg',
    date: '2015-11-20',
    desc:
      'Very interesting and engaging article. Read more',
    content: `
    The special orthogonal group \\( SO(n) \\) consists of all \\( n \\times n \\) real orthogonal matrices with determinant 1:
    \\[
    SO(n) = \\{ A \\in O(n) \\mid \\det(A) = 1 \\}.
    \\]
    To compute its fundamental group, we use the fact that \\( SO(n) \\) is connected and has a well-understood covering space structure.
    
    ### **Step 1: The Double Cover by \\( Spin(n) \\)**
    A key result from topology states that \\( SO(n) \\) is not simply connected for \\( n \\geq 3 \\), but it has a double cover called the **Spin group**, denoted by \\( Spin(n) \\):
    \\[
    1 \\to \\mathbb{Z}_2 \\to Spin(n) \\to SO(n) \\to 1.
    \\]
    This means that \\( Spin(n) \\) is a **universal cover** of \\( SO(n) \\) for \\( n \\geq 3 \\), and the fundamental group of \\( SO(n) \\) is precisely the deck transformation group of this covering map, which is \\( \\mathbb{Z}_2 \\).
    
    ### **Step 2: Homotopy Type of \\( SO(n) \\)**
    For \\( n \\geq 3 \\), it turns out that \\( SO(n) \\) deformation retracts onto \\( SO(3) \\), meaning that they have the same fundamental group:
    \\[
    \\pi_1(SO(n)) \\cong \\pi_1(SO(3)).
    \\]
    It is well known from elementary topology that \\( SO(3) \\) is diffeomorphic to \\( \\mathbb{RP}^3 \\) (the real projective 3-space), which has fundamental group \\( \\mathbb{Z}_2 \\).
    
    ### **Conclusion**
    Since \\( SO(n) \\) for \\( n \\geq 3 \\) has \\( Spin(n) \\) as a double cover, and \\( SO(3) \\) is homotopy equivalent to \\( \\mathbb{RP}^3 \\), we conclude:
    \\[
    \\pi_1(SO(n)) = \\mathbb{Z}_2, \\quad \\text{for } n \\geq 3.
    \\]
    This reflects the fact that any loop in \\( SO(n) \\) can be lifted to \\( Spin(n) \\), and the nontrivial loop corresponds to a sign ambiguity in lifting rotations to spinors.
    `,
  },
];

export default data;
