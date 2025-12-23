import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * ViewOrdersPage Component
 * Page to view orders (both admin and customer)
 */
function ViewOrdersPage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>View Orders</h1>
        <p className="lead">View and manage orders.</p>
        <p>Order management interface will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default ViewOrdersPage;
