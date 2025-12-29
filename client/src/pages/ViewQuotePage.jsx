import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal, Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import quoteService from '../services/quoteService';

/**
 * ViewQuotePage Component
 * For Admins: View and manage ALL customer quote requests
 * For Customers: View and manage their OWN quote requests
 */
function ViewQuotePage() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.userType === 'admin';

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Review form state
  const [reviewFormData, setReviewFormData] = useState({
    status: 'pending',
    estimatedPrice: '',
    notes: ''
  });
  const [reviewValidated, setReviewValidated] = useState(false);

  // Load quotes on component mount
  useEffect(() => {
    fetchQuotes();
  }, [isAdmin]);

  /**
   * Fetch quotes based on user type
   */
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('ViewQuotePage - Fetching quotes...');
      console.log('ViewQuotePage - User:', user);
      console.log('ViewQuotePage - isAdmin:', isAdmin);
      
      let response;
      if (isAdmin) {
        // Admin: Get all quotes
        console.log('ViewQuotePage - Calling getAllQuotes (admin)');
        response = await quoteService.getAllQuotes();
      } else {
        // Customer: Get only their quotes
        console.log('ViewQuotePage - Calling getMyQuotes (customer)');
        response = await quoteService.getMyQuotes();
      }
      
      console.log('ViewQuotePage - Response:', response);
      console.log('ViewQuotePage - Response.data:', response.data);
      console.log('ViewQuotePage - Quotes array:', response.data?.quotes);
      console.log('ViewQuotePage - Number of quotes:', response.data?.quotes?.length);
      
      const quotesArray = response.data?.quotes || [];
      const sortedQuotes = quotesArray.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setQuotes(sortedQuotes);
      console.log('ViewQuotePage - Quotes set in state:', sortedQuotes.length);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      console.error('Error response:', err.response);
      setError('Failed to load quotes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get filtered quotes based on status filter
   */
  const getFilteredQuotes = () => {
    if (statusFilter === 'all') {
      return quotes;
    }
    return quotes.filter(quote => quote.status === statusFilter);
  };

  /**
   * Get status badge variant
   */
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'info';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  /**
   * Format address for display
   */
  const formatAddress = (quote, type) => {
    const prefix = type === 'from' ? 'from' : 'to';
    return `${quote[`${prefix}StreetAddress`]}, ${quote[`${prefix}City`]}, ${quote[`${prefix}State`]} ${quote[`${prefix}ZipCode`]}`;
  };

  /**
   * Handle view details
   */
  const handleViewDetails = (quote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  /**
   * Handle review quote (admin only)
   */
  const handleReviewClick = (quote) => {
    setSelectedQuote(quote);
    setReviewFormData({
      status: quote.status,
      estimatedPrice: quote.estimatedPrice || '',
      notes: quote.notes || ''
    });
    setReviewValidated(false);
    setShowReviewModal(true);
  };

  /**
   * Handle delete quote
   */
  const handleDeleteClick = (quote) => {
    setSelectedQuote(quote);
    setShowDeleteModal(true);
  };

  /**
   * Handle review form input change
   */
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle review form submission
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setReviewValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    try {
      setError('');
      
      // Prepare update data
      const updateData = {
        status: reviewFormData.status,
        notes: reviewFormData.notes
      };
      
      // Only include estimatedPrice if it's provided
      if (reviewFormData.estimatedPrice) {
        updateData.estimatedPrice = parseFloat(reviewFormData.estimatedPrice);
      }

      await quoteService.updateQuote(selectedQuote._id, updateData);
      setSuccess(`Quote #${selectedQuote._id.slice(-6)} updated successfully!`);
      setShowReviewModal(false);
      fetchQuotes();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating quote:', err);
      setError(err.response?.data?.message || 'Failed to update quote. Please try again.');
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      setError('');
      await quoteService.deleteQuote(selectedQuote._id);
      setSuccess(`Quote #${selectedQuote._id.slice(-6)} deleted successfully!`);
      setShowDeleteModal(false);
      fetchQuotes();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting quote:', err);
      setError(err.response?.data?.message || 'Failed to delete quote. Please try again.');
      setShowDeleteModal(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowReviewModal(false);
    setShowDeleteModal(false);
    setSelectedQuote(null);
    setReviewValidated(false);
  };

  const filteredQuotes = getFilteredQuotes();

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1>{isAdmin ? 'View All Quotes' : 'My Quotes'}</h1>
        <p className="lead text-muted mb-0">
          {isAdmin 
            ? 'Review and manage customer quote requests' 
            : 'View and manage your moving quote requests'}
        </p>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Filter Section */}
      <Card className="mb-4" style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <strong>Filter by Status:</strong>
            </Col>
            <Col md={9}>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={statusFilter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setStatusFilter('all')}
                >
                  All ({quotes.length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'pending' ? 'warning' : 'outline-warning'}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending ({quotes.filter(q => q.status === 'pending').length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'reviewed' ? 'info' : 'outline-info'}
                  onClick={() => setStatusFilter('reviewed')}
                >
                  Reviewed ({quotes.filter(q => q.status === 'reviewed').length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'approved' ? 'success' : 'outline-success'}
                  onClick={() => setStatusFilter('approved')}
                >
                  Approved ({quotes.filter(q => q.status === 'approved').length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'rejected' ? 'danger' : 'outline-danger'}
                  onClick={() => setStatusFilter('rejected')}
                >
                  Rejected ({quotes.filter(q => q.status === 'rejected').length})
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Quotes List */}
      {loading ? (
        <div className="text-center py-5">
          <p>Loading quotes...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <Alert variant="info">
          {statusFilter === 'all' 
            ? 'No quotes found. Submit a quote request to get started.'
            : `No ${statusFilter} quotes found.`}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table 
            hover 
            style={{ 
              borderRadius: '15px', 
              border: '2px solid #dee2e6',
              overflow: 'hidden'
            }}
          >
            <thead className="bg-light">
              <tr>
                <th>Quote ID</th>
                {isAdmin && <th>Customer</th>}
                <th>Service</th>
                <th>From</th>
                <th>To</th>
                <th>Move Date</th>
                <th>Status</th>
                <th>Est. Price</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote._id}>
                  <td className="font-monospace">
                    #{quote._id.slice(-6)}
                  </td>
                  {isAdmin && (
                    <td>
                      {quote.userId 
                        ? `${quote.userId.firstName} ${quote.userId.lastName}`
                        : 'Unknown'}
                    </td>
                  )}
                  <td>
                    {quote.serviceId?.title || 'N/A'}
                  </td>
                  <td>
                    <small>{quote.fromCity}, {quote.fromState}</small>
                  </td>
                  <td>
                    <small>{quote.toCity}, {quote.toState}</small>
                  </td>
                  <td>
                    {new Date(quote.moveDate).toLocaleDateString()}
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(quote.status)}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    {quote.estimatedPrice 
                      ? `$${quote.estimatedPrice.toLocaleString()}` 
                      : '-'}
                  </td>
                  <td>
                    <small>{new Date(quote.createdAt).toLocaleDateString()}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => handleViewDetails(quote)}
                        title="View Details"
                      >
                        View
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleReviewClick(quote)}
                          title="Review Quote"
                        >
                          Review
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteClick(quote)}
                        title="Delete Quote"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Quote Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseModals}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Quote Details - #{selectedQuote?._id.slice(-6)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuote && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Status:</strong>
                  <div className="mt-1">
                    <Badge bg={getStatusBadgeVariant(selectedQuote.status)} className="fs-6">
                      {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <strong>Service:</strong>
                  <p className="mb-0 mt-1">{selectedQuote.serviceId?.title || 'N/A'}</p>
                </Col>
              </Row>

              {isAdmin && selectedQuote.userId && (
                <Row className="mb-3">
                  <Col>
                    <strong>Customer Information:</strong>
                    <p className="mb-0 mt-1">
                      {selectedQuote.userId.firstName} {selectedQuote.userId.lastName}
                      <br />
                      <small className="text-muted">{selectedQuote.userId.email}</small>
                    </p>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Moving From:</strong>
                  <p className="mb-0 mt-1">{formatAddress(selectedQuote, 'from')}</p>
                </Col>
                <Col md={6}>
                  <strong>Moving To:</strong>
                  <p className="mb-0 mt-1">{formatAddress(selectedQuote, 'to')}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Move Date:</strong>
                  <p className="mb-0 mt-1">
                    {new Date(selectedQuote.moveDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </Col>
                <Col md={6}>
                  <strong>Estimated Price:</strong>
                  <p className="mb-0 mt-1">
                    {selectedQuote.estimatedPrice 
                      ? `$${selectedQuote.estimatedPrice.toLocaleString()}` 
                      : 'Not yet estimated'}
                  </p>
                </Col>
              </Row>

              {selectedQuote.notes && (
                <Row className="mb-3">
                  <Col>
                    <strong>Admin Notes:</strong>
                    <p className="mb-0 mt-1 p-3 bg-light rounded">{selectedQuote.notes}</p>
                  </Col>
                </Row>
              )}

              <Row className="mb-0">
                <Col md={6}>
                  <strong>Submitted On:</strong>
                  <p className="mb-0 mt-1">
                    {new Date(selectedQuote.createdAt).toLocaleString()}
                  </p>
                </Col>
                <Col md={6}>
                  <strong>Last Updated:</strong>
                  <p className="mb-0 mt-1">
                    {new Date(selectedQuote.updatedAt).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isAdmin && selectedQuote && (
            <Button variant="primary" onClick={() => {
              handleCloseModals();
              handleReviewClick(selectedQuote);
            }}>
              Review Quote
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Review Quote Modal (Admin Only) */}
      {isAdmin && (
        <Modal
          show={showReviewModal}
          onHide={handleCloseModals}
          backdrop="static"
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Review Quote - #{selectedQuote?._id.slice(-6)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedQuote && (
              <>
                <div className="mb-3 p-3 bg-light rounded">
                  <Row>
                    <Col md={6}>
                      <small className="text-muted">Customer:</small>
                      <p className="mb-0 fw-bold">
                        {selectedQuote.userId?.firstName} {selectedQuote.userId?.lastName}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted">Service:</small>
                      <p className="mb-0 fw-bold">{selectedQuote.serviceId?.title}</p>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={6}>
                      <small className="text-muted">From:</small>
                      <p className="mb-0">{selectedQuote.fromCity}, {selectedQuote.fromState}</p>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted">To:</small>
                      <p className="mb-0">{selectedQuote.toCity}, {selectedQuote.toState}</p>
                    </Col>
                  </Row>
                </div>

                <Form noValidate validated={reviewValidated} onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={reviewFormData.status}
                      onChange={handleReviewChange}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Estimated Price (USD)</Form.Label>
                    <Form.Control
                      type="number"
                      name="estimatedPrice"
                      value={reviewFormData.estimatedPrice}
                      onChange={handleReviewChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter estimated price"
                    />
                    <Form.Text className="text-muted">
                      Leave blank if not yet estimated
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Admin Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="notes"
                      value={reviewFormData.notes}
                      onChange={handleReviewChange}
                      placeholder="Add notes about this quote (visible to customer)"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 justify-content-end">
                    <Button variant="secondary" onClick={handleCloseModals}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Review
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseModals}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this quote?</p>
          {selectedQuote && (
            <div className="bg-light p-3 rounded">
              <strong>Quote #{selectedQuote._id.slice(-6)}</strong>
              {isAdmin && selectedQuote.userId && (
                <p className="mb-1 mt-2">
                  <small className="text-muted">Customer:</small> {selectedQuote.userId.firstName} {selectedQuote.userId.lastName}
                </p>
              )}
              <p className="mb-1">
                <small className="text-muted">From:</small> {selectedQuote.fromCity}, {selectedQuote.fromState}
              </p>
              <p className="mb-1">
                <small className="text-muted">To:</small> {selectedQuote.toCity}, {selectedQuote.toState}
              </p>
              <p className="mb-0">
                <small className="text-muted">Move Date:</small> {new Date(selectedQuote.moveDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <Alert variant="warning" className="mt-3 mb-0">
            <small>⚠️ This action cannot be undone.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Quote
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ViewQuotePage;
