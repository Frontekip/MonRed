'use client';

import { Navbar, Container, Nav } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/dashboard">
          <i className="fas fa-database me-2"></i>
          MonRed
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
} 