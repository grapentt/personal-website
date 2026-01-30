import React from 'react';
import BlogArticle1 from './articles/BlogArticle1';

const PUBLIC_URL = import.meta.env.BASE_URL;

export interface BlogArticleData {
  title: string;
  subtitle: string;
  image: string;
  date: string;
  desc: string;
  content: React.FC;
}

// TODO Add a couple lines about each project
const data: BlogArticleData[] = [
  {
    title: 'A geometric introduction to quaternions - A first glimpse into the 4th dimension',
    subtitle: 'Subtitle',
    image: `${PUBLIC_URL}/visuals/isoclinicTesseract.gif`,
    date: '2025-02-13',
    desc:
      'This article offers a first glimpse into the fascinating world of 4-dimensional space '
      + 'through the lens of symmetry/rotations. We\'ll unravel the structure of 4D space, where rotations '
      + 'and transformations defy our 3D intuition, and discover how quaternions—a remarkable 4D '
      + 'number system—naturally emerge as the key to understanding these higher-dimensional symmetries. Along the way, we\'ll decode the enigmatic '
      + 'GIF above, which visualizes a tesseract (a cube living in 4D) projected into 3D and (doubly) rotated. No advanced prerequisites are needed—just '
      + 'a curiosity for the beauty of mathematics and the mysteries of higher dimensions!',
    content: BlogArticle1,
  },
];

export default data;
