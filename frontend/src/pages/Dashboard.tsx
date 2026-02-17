import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import Companies from './Companies'
import Users from './Users'
import Teams from './Teams'
import Roles from './Roles';
import Sites from './Sites';
import CustomFields from './CustomFields';
import ImageUploadDemo from '../components/ImageUploadDemo';

const Dashboard = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
                <h3 className="mb-4">People Module</h3>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/dashboard" className="text-white">Dashboard Overview</Nav.Link>
                    <Nav.Link as={Link} to="/companies" className="text-white">Companies</Nav.Link>
                    <Nav.Link as={Link} to="/sites" className="text-white">Sites</Nav.Link>
                    <Nav.Link as={Link} to="/users" className="text-white">Users</Nav.Link>
                    <Nav.Link as={Link} to="/teams" className="text-white">Teams</Nav.Link>
                    <Nav.Link as={Link} to="/roles" className="text-white">Roles (RBAC)</Nav.Link>
                    <Nav.Link as={Link} to="/custom-fields" className="text-white">Custom Fields</Nav.Link>
                    <Nav.Link as={Link} to="/upload-demo" className="text-white">Image Storage (R2)</Nav.Link>
                </Nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 bg-light">
                <Navbar bg="white" className="border-bottom px-3">
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="me-3">
                            Signed in as: <strong>{user?.email}</strong>
                        </Navbar.Text>
                        <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>

                <Container className="py-4">
                    <Routes>
                        <Route path="/dashboard" element={<div><h4>Welcome to your People Module Dashboard</h4><p>Select a category from the sidebar to manage your organization.</p></div>} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="sites" element={<Sites />} />
                        <Route path="users" element={<Users />} />
                        <Route path="teams" element={<Teams />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="custom-fields" element={<CustomFields />} />
                        <Route path="upload-demo" element={<ImageUploadDemo />} />
                    </Routes>
                </Container>
            </div>
        </div>
    )
}

export default Dashboard
