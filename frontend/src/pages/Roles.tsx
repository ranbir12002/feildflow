import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchRoles } from '../api/apiService'
import RoleModal from '../components/RoleModal'

const Roles = () => {
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)

    const loadRoles = () => {
        setLoading(true)
        fetchRoles()
            .then(res => setRoles(res.data))
            .catch(err => setError('Failed to load roles'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadRoles()
    }, [])

    if (loading && roles.length === 0) return <Spinner animation="border" />
    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Custom Roles (RBAC)</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Create Role</Button>
            </div>

            <RoleModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSuccess={loadRoles}
            />

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Users Assigned</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role: any) => (
                        <tr key={role.id}>
                            <td>{role.name}</td>
                            <td>{role.description || '-'}</td>
                            <td>-</td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                                <Button variant="outline-danger" size="sm">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {roles.length === 0 && <tr><td colSpan={4} className="text-center">No custom roles found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default Roles
