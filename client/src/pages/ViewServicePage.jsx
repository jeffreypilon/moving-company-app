import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * ViewServicePage Component
 * Admin page to view all services
 */
function ViewServicePage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>View Services</h1>
        <p className="lead">Manage all services offered by Star Movers.</p>
        <p>Service listing and management interface will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default ViewServicePage;
