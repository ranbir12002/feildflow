import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchUsers, deleteUser } from '../api/apiService'
import UserModal from '../components/UserModal'

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)

    const loadUsers = () => {
        setLoading(true)
        fetchUsers()
            .then(res => setUsers(res.data))
            .catch(err => setError('Failed to load users'))
            .finally(() => setLoading(false))
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    }

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    }

    useEffect(() => {
        loadUsers()
    }, [])

    if (loading && users.length === 0) return <Spinner animation="border" />
    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Users</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
            </div>

            <UserModal
                show={showModal}
                onHide={handleCloseModal}
                onSuccess={loadUsers}
                user={editingUser}
            />

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span className="badge bg-info text-dark">{user.role?.name || 'No Role'}</span></td>
                            <td>
                                <span className={`badge bg-${user.status === 'active' ? 'success' : 'secondary'}`}>{user.status}</span>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(user)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={6} className="text-center">No users found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default Users
