import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchSites } from '../api/apiService'
import SiteModal from '../components/SiteModal'

const Sites = () => {
    const [sites, setSites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)

    const loadSites = () => {
        setLoading(true)
        fetchSites()
            .then(res => setSites(res.data))
            .catch(err => setError('Failed to load sites'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadSites()
    }, [])

    if (loading && sites.length === 0) return <Spinner animation="border" className="m-3" />
    if (error) return <Alert variant="danger" className="m-3">{error}</Alert>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Sites</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Site</Button>
            </div>

            <SiteModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSuccess={loadSites}
            />

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Site Name</th>
                        <th>Company</th>
                        <th>Address / City</th>
                        <th>Primary Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sites.map((site: any) => (
                        <tr key={site.id}>
                            <td>{site.name}</td>
                            <td>{site.company?.name || '-'}</td>
                            <td>
                                {site.address?.Address ? `${site.address.Address}, ` : ''}
                                {site.address?.City || ''}
                            </td>
                            <td>
                                {site.primaryContact?.GivenName} {site.primaryContact?.FamilyName}
                                <br />
                                <small className="text-muted">{site.primaryContact?.Email}</small>
                            </td>
                            <td>
                                <span className={`badge bg-${site.archived ? 'secondary' : 'success'}`}>
                                    {site.archived ? 'Archived' : 'Active'}
                                </span>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">View</Button>
                                <Button variant="outline-danger" size="sm">Archive</Button>
                            </td>
                        </tr>
                    ))}
                    {sites.length === 0 && <tr><td colSpan={6} className="text-center">No sites found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default Sites
