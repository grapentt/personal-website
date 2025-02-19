import BlogArticle1 from './latexArticles/BlogArticle1';

const { PUBLIC_URL } = process.env;
// TODO Add a couple lines about each project
const data = [
  {
    title: 'A geometric introduction to quaternions - A first glimpse into the 4th dimension',
    subtitle: 'Subtitle',
    image: `${PUBLIC_URL}/visuals/tesseract.gif`,
    date: '2025-02-13',
    desc:
      'This article offers a first glimpse into the fascinating world of 4-dimensional space '
      + 'through the lens of symmetry/rotations. We’ll unravel the structure of 4D space, where rotations '
      + 'and transformations defy our 3D intuition, and discover how quaternions—a remarkable 4D '
      + 'number system—naturally emerge as the key to understanding these higher-dimensional symmetries.',
    content: BlogArticle1,
  },
];

export default data;
