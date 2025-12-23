import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * RequestServicePage Component
 * Customer page to request moving services
 */
function RequestServicePage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>Request Service</h1>
        <p className="lead">Submit a request for moving services.</p>
        <p>Service request form will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default RequestServicePage;
