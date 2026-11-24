import Video from './Video';
import { asset } from '../app/site';
import type { ArticleEntry } from '../content/articles/types';
import StagePoster from '../stage/react/StagePoster';

/** The picture that represents an article on cards: a video, an image, or the poster frame of its film. */
const ArticlePoster = ({ article }: { article: ArticleEntry }) => {
  const { poster } = article;
  if (poster?.video) return <Video src={poster.video} alt={poster.alt} />;
  if (poster?.image) return <img src={asset(poster.image)} alt={poster.alt} loading="lazy" />;
  if (article.kind === 'film') return <StagePoster slug={article.slug} alt={poster?.alt ?? article.title} />;
  return null;
};

export default ArticlePoster;
