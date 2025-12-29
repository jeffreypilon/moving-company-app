import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal, Form, Table } from 'react-bootstrap';
import authService from '../services/authService';

/**
 * ViewUsersPage Component
 * Admin page to view and manage all users
 */
function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter state
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'customer'
  });
  const [editValidated, setEditValidated] = useState(false);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetch all users
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.getAllUsers();
      console.log('ViewUsersPage - Response:', response);
      
      const usersArray = response.data?.users || response.users || [];
      const sortedUsers = usersArray.sort((a, b) => 
        a.lastName.localeCompare(b.lastName)
      );
      setUsers(sortedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get filtered users based on user type filter
   */
  const getFilteredUsers = () => {
    if (userTypeFilter === 'all') {
      return users;
    }
    return users.filter(user => user.userType === userTypeFilter);
  };

  /**
   * Get user type badge variant
   */
  const getUserTypeBadgeVariant = (userType) => {
    return userType === 'admin' ? 'danger' : 'primary';
  };

  /**
   * Handle view details
   */
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  /**
   * Handle edit user
   */
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      userType: user.userType
    });
    setEditValidated(false);
    setShowEditModal(true);
  };

  /**
   * Handle delete user
   */
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  /**
   * Handle edit form input change
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle edit form submission
   */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setEditValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    try {
      setError('');
      await authService.updateUser(selectedUser.id, editFormData);
      setSuccess(`User "${editFormData.firstName} ${editFormData.lastName}" updated successfully!`);
      setShowEditModal(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user. Please try again.');
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      setError('');
      await authService.deleteUser(selectedUser.id);
      setSuccess(`User "${selectedUser.firstName} ${selectedUser.lastName}" deleted successfully!`);
      setShowDeleteModal(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      setShowDeleteModal(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setEditValidated(false);
  };

  const filteredUsers = getFilteredUsers();

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1>View Users</h1>
        <p className="lead text-muted mb-0">
          Manage all registered users and their details
        </p>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Filter Section */}
      <Card className="mb-4" style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <strong>Filter by User Type:</strong>
            </Col>
            <Col md={9}>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={userTypeFilter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setUserTypeFilter('all')}
                >
                  All Users ({users.length})
                </Button>
                <Button
                  size="sm"
                  variant={userTypeFilter === 'admin' ? 'danger' : 'outline-danger'}
                  onClick={() => setUserTypeFilter('admin')}
                >
                  Admins ({users.filter(u => u.userType === 'admin').length})
                </Button>
                <Button
                  size="sm"
                  variant={userTypeFilter === 'customer' ? 'primary' : 'outline-primary'}
                  onClick={() => setUserTypeFilter('customer')}
                >
                  Customers ({users.filter(u => u.userType === 'customer').length})
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-5">
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Alert variant="info">
          {userTypeFilter === 'all' 
            ? 'No users found.'
            : `No ${userTypeFilter} users found.`}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User Type</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.firstName} {user.lastName}</strong>
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td>
                    {user.phone || '-'}
                  </td>
                  <td>
                    <Badge bg={getUserTypeBadgeVariant(user.userType)}>
                      {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => handleViewDetails(user)}
                        title="View Details"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User"
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

      {/* User Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseModals}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>First Name:</strong>
                  <p className="mb-0 mt-1">{selectedUser.firstName}</p>
                </Col>
                <Col md={6}>
                  <strong>Last Name:</strong>
                  <p className="mb-0 mt-1">{selectedUser.lastName}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Email:</strong>
                  <p className="mb-0 mt-1">{selectedUser.email}</p>
                </Col>
                <Col md={6}>
                  <strong>Phone:</strong>
                  <p className="mb-0 mt-1">{selectedUser.phone || 'Not provided'}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>User Type:</strong>
                  <div className="mt-1">
                    <Badge bg={getUserTypeBadgeVariant(selectedUser.userType)} className="fs-6">
                      {selectedUser.userType.charAt(0).toUpperCase() + selectedUser.userType.slice(1)}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <strong>Photo:</strong>
                  <p className="mb-0 mt-1">{selectedUser.photoFilename || 'No photo'}</p>
                </Col>
              </Row>

              <Row className="mb-0">
                <Col md={6}>
                  <strong>Registered On:</strong>
                  <p className="mb-0 mt-1">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                </Col>
                <Col md={6}>
                  <strong>Last Updated:</strong>
                  <p className="mb-0 mt-1">
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            handleCloseModals();
            handleEditClick(selectedUser);
          }}>
            Edit User
          </Button>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseModals}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted">Editing user:</small>
                <p className="mb-0 fw-bold">
                  {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
                </p>
              </div>

              <Form noValidate validated={editValidated} onSubmit={handleEditSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleEditChange}
                        required
                        placeholder="Enter first name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a first name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleEditChange}
                        required
                        placeholder="Enter last name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>User Type</Form.Label>
                  <Form.Select
                    name="userType"
                    value={editFormData.userType}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="secondary" onClick={handleCloseModals}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

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
          <p>Are you sure you want to delete this user?</p>
          {selectedUser && (
            <div className="bg-light p-3 rounded">
              <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
              <p className="mb-1 mt-2">
                <small className="text-muted">Email:</small> {selectedUser.email}
              </p>
              <p className="mb-0">
                <small className="text-muted">User Type:</small> {' '}
                <Badge bg={getUserTypeBadgeVariant(selectedUser.userType)}>
                  {selectedUser.userType.charAt(0).toUpperCase() + selectedUser.userType.slice(1)}
                </Badge>
              </p>
            </div>
          )}
          <Alert variant="warning" className="mt-3 mb-0">
            <small>⚠️ This action cannot be undone. All user data will be permanently deleted.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ViewUsersPage;
