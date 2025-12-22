import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="text-center p-5">
              <h1 className="mb-4">Welcome to the Dashboard</h1>
              
              {user && (
                <div className="mb-4">
                  <p className="lead">
                    Hello, {user.firstName || user.email}!
                  </p>
                  <p className="text-muted">
                    User Type: <strong className="text-capitalize">{user.userType}</strong>
                  </p>
                </div>
              )}

              <Button 
                variant="outline-primary" 
                onClick={handleLogout}
                className="mt-3"
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
