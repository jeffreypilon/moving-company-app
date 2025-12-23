import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * ViewQuotePage Component
 * Admin page to view customer quote requests
 */
function ViewQuotePage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>View Quotes</h1>
        <p className="lead">Review and manage customer quote requests.</p>
        <p>Quote management interface will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default ViewQuotePage;
