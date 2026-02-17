import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createCompany } from '../api/apiService';

interface CompanyModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        trading_name: '',
        abn: '',
        phone: '',
        email: '',
        website: '',
        address_street: '',
        address_suburb: '',
        address_state: '',
        address_postcode: '',
        address_country: 'Australia',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createCompany(formData);
            onSuccess();
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Company</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formCompanyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formTradingName">
                            <Form.Label>Trading Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="trading_name"
                                value={formData.trading_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formABN">
                            <Form.Label>ABN / ACN</Form.Label>
                            <Form.Control
                                type="text"
                                name="abn"
                                value={formData.abn}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formWebsite">
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <hr />
                    <h5>Address Details</h5>
                    <Form.Group className="mb-3" controlId="formAddressStreet">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address_street"
                            value={formData.address_street}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formSuburb">
                            <Form.Label>Suburb</Form.Label>
                            <Form.Control
                                type="text"
                                name="address_suburb"
                                value={formData.address_suburb}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formState">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="address_state"
                                value={formData.address_state}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formPostcode">
                            <Form.Label>Postcode</Form.Label>
                            <Form.Control
                                type="text"
                                name="address_postcode"
                                value={formData.address_postcode}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formNotes">
                        <Form.Label>Internal Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Company'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CompanyModal;
