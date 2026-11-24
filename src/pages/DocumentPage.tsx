import Seo from '../components/Seo';
import { asset } from '../app/site';

const documents = {
  resume: { title: 'Résumé', file: 'Resume.pdf', lede: 'Education, experience and skills on one page.' },
  thesis: { title: 'Bachelor’s thesis', file: 'thesis.pdf', lede: 'Seiberg–Witten theory and the differential topology of 4-manifolds.' },
};

const DocumentPage = ({ kind }: { kind: keyof typeof documents }) => {
  const doc = documents[kind];
  return (
    <div className="container page">
      <Seo title={doc.title} path={`/${kind}`} description={doc.lede} />
      <header className="page-header">
        <p className="eyebrow">Document</p>
        <h1>{doc.title}</h1>
        <p className="lede">
          {doc.lede} <a href={asset(doc.file)}>Open the PDF</a> if the viewer below does not load.
        </p>
      </header>
      <div className="document-frame">
        <iframe src={asset(doc.file)} title={doc.title} />
      </div>
    </div>
  );
};

export default DocumentPage;
