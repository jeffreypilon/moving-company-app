import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * ViewMessagePage Component
 * Admin page to view customer messages
 */
function ViewMessagePage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>View Messages</h1>
        <p className="lead">View and respond to customer messages.</p>
        <p>Message inbox will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default ViewMessagePage;
