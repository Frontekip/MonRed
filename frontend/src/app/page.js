'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <Container className="py-5">
        <Row className="align-items-center min-vh-100">
          <Col md={6} className="text-center text-md-start">
            <h1 className="display-4 fw-bold mb-4">
              <span className="text-primary">MonRed</span>
              <br />
              Your Database Cloud
            </h1>
            <p className="lead mb-4">
              Deploy and manage MongoDB and Redis instances instantly.
              Simple, secure, and scalable database hosting platform.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push('/register')}
              >
                <i className="fas fa-rocket me-2"></i>
                Get Started
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg"
                onClick={() => router.push('/login')}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </Button>
            </div>
          </Col>
          <Col md={6} className="text-center mt-5 mt-md-0">
            <div className={styles.features}>
              <div className={styles.featureCard}>
                <i className="fas fa-database fa-2x mb-3 text-primary"></i>
                <h3>MongoDB</h3>
                <p>Deploy MongoDB instances with full control</p>
              </div>
              <div className={styles.featureCard}>
                <i className="fas fa-bolt fa-2x mb-3 text-danger"></i>
                <h3>Redis</h3>
                <p>High-performance Redis deployments</p>
              </div>
              <div className={styles.featureCard}>
                <i className="fas fa-shield-alt fa-2x mb-3 text-success"></i>
                <h3>Secure</h3>
                <p>Automatic security configuration</p>
              </div>
              <div className={styles.featureCard}>
                <i className="fas fa-tachometer-alt fa-2x mb-3 text-info"></i>
                <h3>Monitor</h3>
                <p>Real-time logs and performance metrics</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
} 