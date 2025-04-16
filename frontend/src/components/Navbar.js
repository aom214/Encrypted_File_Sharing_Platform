import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './NavbarStyles.css';

function OffcanvasExample({ onLogout }) {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="custom-navbar mb-3">
          <Container fluid>
            <Navbar.Brand href="#" className="navbar-brand">
              <img 
                src="https://www.sahyogcph.org/wp-content/uploads/2024/05/ahmedabad_uniersity_logo.png" 
                alt="Ahmedabad University" 
                className="brand-logo"
              />
            </Navbar.Brand>
            <div className="navbar-right">
              
              
             
            </div>
            <Navbar.Toggle 
              aria-controls={`offcanvasNavbar-expand-${expand}`} 
              className="custom-toggler"
            />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
              className="custom-offcanvas"
            >
              <Offcanvas.Header closeButton className="offcanvas-header">
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <img 
                    src="https://www.sahyogcph.org/wp-content/uploads/2024/05/ahmedabad_uniersity_logo.png" 
                    alt="Ahmedabad University" 
                    className="offcanvas-logo"
                  />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="offcanvas-body">
                <Nav className="justify-content-end flex-grow-1 pe-3 nav-links">
                  <Nav.Link href="/" className="nav-item">Home</Nav.Link>
                  <Nav.Link href="/share-file" className="nav-item">Share File</Nav.Link>
                  <Nav.Link href="/files" className="nav-item">View Received Files</Nav.Link>
                  <Nav.Link href="/request" className="nav-item">Notifications</Nav.Link>
                  <Nav.Link href="/add-friends" className="nav-item">Add Friend</Nav.Link>
                  <Nav.Link href="/EncryptFile" className="nav-item">Encrypt File</Nav.Link>
                  <Nav.Link href="/DecryptFile" className="nav-item">Decrypt File</Nav.Link>
                  <Nav.Link href="/profile" className="nav-item">Profile</Nav.Link>
                  <Nav.Link href="/Admin" className="nav-item">Admin Page</Nav.Link>
                  <Nav.Link onClick={onLogout} className="nav-item">Logout</Nav.Link>
                </Nav>
                <Form className="d-flex search-form">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="search-input"
                    aria-label="Search"
                  />
                  <Button variant="outline-success" className="search-button">
                    Search
                  </Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default OffcanvasExample;