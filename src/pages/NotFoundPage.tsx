import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const NotFoundPage = () => (
  <div className="container page not-found">
    <Seo title="Not found" description="This page does not exist." />
    <h1>404</h1>
    <p className="lede">There is nothing at this address.</p>
    <p style={{ marginTop: '1.5rem' }}>
      <Link to="/" className="button">Back home</Link>
    </p>
  </div>
);

export default NotFoundPage;
