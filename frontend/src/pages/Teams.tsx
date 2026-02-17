import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchTeams } from '../api/apiService'
import TeamModal from '../components/TeamModal'

const Teams = () => {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)

    const loadTeams = () => {
        setLoading(true)
        fetchTeams()
            .then(res => setTeams(res.data))
            .catch(err => setError('Failed to load teams'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadTeams()
    }, [])

    if (loading && teams.length === 0) return <Spinner animation="border" />
    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Teams</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Team</Button>
            </div>

            <TeamModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSuccess={loadTeams}
            />

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team: any) => (
                        <tr key={team.id}>
                            <td>{team.name}</td>
                            <td>{team.description || '-'}</td>
                            <td><span className={`badge bg-${team.status === 'active' ? 'success' : 'secondary'}`}>{team.status}</span></td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">Manage Members</Button>
                                <Button variant="outline-danger" size="sm">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {teams.length === 0 && <tr><td colSpan={4} className="text-center">No teams found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default Teams
