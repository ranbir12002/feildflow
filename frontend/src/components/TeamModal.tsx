import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createTeam, fetchCompanies, fetchUsers } from '../api/apiService';

interface TeamModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        companyIds: [] as string[],
        userIds: [] as string[]
    });
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            fetchCompanies().then(res => setCompanies(res.data)).catch(() => { });
            fetchUsers().then(res => setUsers(res.data)).catch(() => { });
        }
    }, [show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCompanyChange = (companyId: string) => {
        const current = [...formData.companyIds];
        const index = current.indexOf(companyId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(companyId);
        }
        setFormData({ ...formData, companyIds: current });
    };

    const handleUserChange = (userId: string) => {
        const current = [...formData.userIds];
        const index = current.indexOf(userId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(userId);
        }
        setFormData({ ...formData, userIds: current });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createTeam(formData);
            onSuccess();
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create team');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Team</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form.Group className="mb-3" controlId="formTeamName">
                        <Form.Label>Team Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <hr />
                    <h5>Assign to Companies</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {companies.map((company: any) => (
                            <Form.Check
                                key={company.id}
                                type="checkbox"
                                id={`team-company-${company.id}`}
                                label={company.name}
                                checked={formData.companyIds.includes(company.id)}
                                onChange={() => handleCompanyChange(company.id)}
                            />
                        ))}
                    </div>
                    {companies.length === 0 && <small className="text-muted">No companies found. Create one first.</small>}

                    <hr />
                    <h5>Add Members (Users)</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {users.map((user: any) => (
                            <Form.Check
                                key={user.id}
                                type="checkbox"
                                id={`team-user-${user.id}`}
                                label={user.name}
                                checked={formData.userIds.includes(user.id)}
                                onChange={() => handleUserChange(user.id)}
                            />
                        ))}
                    </div>
                    {users.length === 0 && <small className="text-muted">No users found. Create one first.</small>}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Team'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TeamModal;
