import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Spinner } from "react-bootstrap";
import { useAuth } from "../context/authContext";

export default function CustomNavbar() {
  const { pathname } = useLocation();
  const { isLoggedIn, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isActive = (href) => pathname === href;

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="primary" // Calming hospital blue
      variant="dark" // Text color becomes white
      className="shadow-sm fixed-top z-3"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fs-3 fw-semibold d-flex align-items-center gap-2"
        >
          🏥 <span>Hospital System</span>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="fs-5 align-items-center">
            {isLoggedIn ? (
              <NavDropdown
                title={`Hello, ${user.username || "User"}`}
                id="basic-nav-dropdown"
                menuVariant="light"
              >
                <NavDropdown.Item as={Link} to={`/${user.role.toLowerCase()}`}>
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className={`px-3 mx-2 ${
                  isActive("/login") ? "text-white fw-bold" : "text-light"
                }`}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
