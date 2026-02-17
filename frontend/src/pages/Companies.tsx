import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchCompanies } from '../api/apiService'
import CompanyModal from '../components/CompanyModal'

const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)

    const loadCompanies = () => {
        setLoading(true)
        fetchCompanies()
            .then(res => setCompanies(res.data))
            .catch(err => setError('Failed to load companies'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadCompanies()
    }, [])

    if (loading && companies.length === 0) return <Spinner animation="border" />
    if (error) return <Alert variant="danger">{error}</Alert>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Companies</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Company</Button>
            </div>

            <CompanyModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSuccess={loadCompanies}
            />

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>ABN</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company: any) => (
                        <tr key={company.id}>
                            <td>{company.name}</td>
                            <td>{company.abn || '-'}</td>
                            <td>{company.email || '-'}</td>
                            <td>{company.phone || '-'}</td>
                            <td><span className={`badge bg-${company.status === 'active' ? 'success' : 'secondary'}`}>{company.status}</span></td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                                <Button variant="outline-danger" size="sm">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {companies.length === 0 && <tr><td colSpan={6} className="text-center">No companies found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default Companies
