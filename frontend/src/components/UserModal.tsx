import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createUser, fetchCompanies, fetchRoles, fetchTeams, updateUser } from '../api/apiService';
import CustomFieldsView from './CustomFieldsView';

interface UserModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    user?: any; // Added user prop for editing
}

const UserModal: React.FC<UserModalProps> = ({ show, onHide, onSuccess, user }) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        password: '',
        roleId: '',
        companyIds: [] as string[],
        teamIds: [] as string[],
        customFields: {}
    });
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            fetchCompanies().then(res => setCompanies(res.data)).catch(() => { });
            fetchRoles().then(res => setRoles(res.data)).catch(() => { });
            fetchTeams().then(res => setTeams(res.data)).catch(() => { });

            if (user) {
                const cfValues: Record<string, string> = {};
                user.customFields?.forEach((cf: any) => {
                    cfValues[cf.customFieldId] = cf.value;
                });

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '', // Don't pre-populate password
                    roleId: user.roleId || '',
                    companyIds: user.companies?.map((c: any) => c.id) || [],
                    teamIds: user.teams?.map((t: any) => t.id) || [],
                    customFields: cfValues
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    roleId: '',
                    companyIds: [],
                    teamIds: [],
                    customFields: {}
                });
            }
        }
    }, [show, user]);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCustomFieldChange = (fieldId: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            customFields: {
                ...prev.customFields,
                [fieldId]: value
            }
        }));
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
    }; const handleTeamChange = (teamId: string) => {
        const current = [...formData.teamIds];
        const index = current.indexOf(teamId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(teamId);
        }
        setFormData({ ...formData, teamIds: current });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (user) {
                await updateUser(user.id, formData);
            } else {
                await createUser(formData);
            }
            onSuccess();
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to process user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{user ? 'Edit Employee / User' : 'Add New Employee / User'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password (Optional - Defaults provided)</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Leave blank for default"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label>System Role</Form.Label>
                        <Form.Select name="roleId" value={formData.roleId} onChange={handleChange} required>
                            <option value="">Select a role...</option>
                            {roles.map((role: any) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <CustomFieldsView
                        module="USER"
                        values={formData.customFields}
                        onChange={handleCustomFieldChange}
                    />

                    <hr />
                    <h5>Assign to Companies</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {companies.map((company: any) => (
                            <Form.Check
                                key={company.id}
                                type="checkbox"
                                id={`check-company-${company.id}`}
                                label={company.name}
                                checked={formData.companyIds.includes(company.id)}
                                onChange={() => handleCompanyChange(company.id)}
                            />
                        ))}
                    </div>
                    {companies.length === 0 && <small className="text-muted">No companies found. Create one first.</small>}

                    <hr />
                    <h5>Assign to Teams</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {teams.map((team: any) => (
                            <Form.Check
                                key={team.id}
                                type="checkbox"
                                id={`check-team-${team.id}`}
                                label={team.name}
                                checked={formData.teamIds.includes(team.id)}
                                onChange={() => handleTeamChange(team.id)}
                            />
                        ))}
                    </div>
                    {teams.length === 0 && <small className="text-muted">No teams found. Create one first.</small>}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserModal;
