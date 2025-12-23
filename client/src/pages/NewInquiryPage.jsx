import { Container } from 'react-bootstrap';
import ProtectedRoute from '../routes/ProtectedRoute';

/**
 * NewInquiryPage Component
 * Customer page to submit general inquiries
 */
function NewInquiryPage() {
  return (
    <ProtectedRoute>
      <Container className="py-5">
        <h1>New Inquiry</h1>
        <p className="lead">Submit a general inquiry or question.</p>
        <p>Inquiry form will be added later.</p>
      </Container>
    </ProtectedRoute>
  );
}

export default NewInquiryPage;
