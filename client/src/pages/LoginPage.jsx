import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'admin'
  });

  // Validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear redux error
    if (error) {
      dispatch(clearError());
    }
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Email must include @ symbol';
    }
    if (!email.includes('.com')) {
      return 'Email must include .com';
    }
    return '';
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length > 10) {
      return 'Password must be limited to 10 characters';
    }
    // Check if alphanumeric (letters and numbers only)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(password)) {
      return 'Password must be alphanumeric (letters and numbers only)';
    }
    return '';
  };

  // Validate form
  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    return !emailError && !passwordError;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch login action
      const result = await dispatch(login(formData)).unwrap();
      
      // Navigate to dashboard on success
      if (result) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by Redux slice
      console.error('Login failed:', err);
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      email: '',
      password: '',
      userType: 'admin'
    });
    setErrors({
      email: '',
      password: ''
    });
    dispatch(clearError());
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign In</h2>

              {error && (
                <Alert 
                  variant="danger" 
                  dismissible 
                  onClose={() => dispatch(clearError())}
                >
                  {error}
                </Alert>
              )}

              <div className="border rounded p-4 mb-3">
                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                    />
                    {errors.email && (
                      <Form.Text className="text-danger d-block">
                        {errors.email}
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      maxLength={10}
                      isInvalid={!!errors.password}
                    />
                    {errors.password && (
                      <Form.Text className="text-danger d-block">
                        {errors.password}
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* User Type Radio Buttons */}
                  <Form.Group className="mb-4">
                    <Form.Label>Type of User</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        id="userType-admin"
                        name="userType"
                        value="admin"
                        label="Admin"
                        checked={formData.userType === 'admin'}
                        onChange={handleChange}
                        inline
                      />
                      <Form.Check
                        type="radio"
                        id="userType-customer"
                        name="userType"
                        value="customer"
                        label="Customer"
                        checked={formData.userType === 'customer'}
                        onChange={handleChange}
                        inline
                      />
                    </div>
                  </Form.Group>

                  {/* Buttons */}
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant="secondary"
                        type="button"
                        className="w-100"
                        onClick={handleReset}
                        disabled={loading}
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link to="/signup" className="text-decoration-none">
                  Sign Up
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
