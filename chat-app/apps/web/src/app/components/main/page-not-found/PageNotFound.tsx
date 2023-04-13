import { Container } from 'react-bootstrap';

import image404 from '../../../../assets/image/404-error.gif';
import './PageNotFound.scss';

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <Container className="d-flex justify-content-center">
        <img className="image-404" src={image404} alt="Page not found" />
      </Container>
    </div>
  );
};

export default PageNotFound;
