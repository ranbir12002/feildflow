import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createSite, fetchCompanies } from '../api/apiService';
import CustomFieldsView from './CustomFieldsView';

interface SiteModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const SiteModal: React.FC<SiteModalProps> = ({ show, onHide, onSuccess }) => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState<any>({
        name: '',
        companyId: '',
        address: {
            Address: '',
            City: '',
            State: '',
            PostalCode: '',
            Country: 'Australia'
        },
        billingAddress: {
            Address: '',
            City: '',
            State: '',
            PostalCode: ''
        },
        primaryContact: {
            GivenName: '',
            FamilyName: '',
            Email: '',
            WorkPhone: '',
            Position: ''
        },
        publicNotes: '',
        customFields: {}
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            fetchCompanies().then(res => setCompanies(res.data)).catch(console.error);
        }
    }, [show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyId) {
            setError('Please select a company');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await createSite(formData.companyId, formData);
            onSuccess();
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create site');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Site</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formSiteName">
                            <Form.Label>Site Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formCompany">
                            <Form.Label>Company</Form.Label>
                            <Form.Select
                                name="companyId"
                                value={formData.companyId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Company...</option>
                                {companies.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <hr />
                    <h5>Primary Address</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address.Address"
                            value={formData.address.Address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="address.City"
                                value={formData.address.City}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="address.State"
                                value={formData.address.State}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Postcode</Form.Label>
                            <Form.Control
                                type="text"
                                name="address.PostalCode"
                                value={formData.address.PostalCode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <hr />
                    <h5>Contact Person</h5>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="primaryContact.GivenName"
                                value={formData.primaryContact.GivenName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="primaryContact.FamilyName"
                                value={formData.primaryContact.FamilyName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="primaryContact.Email"
                                value={formData.primaryContact.Email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Work Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="primaryContact.WorkPhone"
                                value={formData.primaryContact.WorkPhone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Public Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="publicNotes"
                            value={formData.publicNotes}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <CustomFieldsView
                        module="SITE"
                        values={formData.customFields}
                        onChange={handleCustomFieldChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Site'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SiteModal;
