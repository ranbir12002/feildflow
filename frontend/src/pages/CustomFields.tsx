import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { fetchCustomFields, createCustomField, deleteCustomField } from '../api/apiService';

const CustomFields = () => {
    const [fields, setFields] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        label: '',
        type: 'TEXT',
        module: 'USER',
        required: false,
        options: ''
    });

    const loadFields = () => {
        setLoading(true);
        fetchCustomFields()
            .then(res => setFields(res.data))
            .catch(() => setError('Failed to load fields'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadFields();
    }, []);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                name: formData.name.toLowerCase().replace(/\s+/g, '_'),
                options: formData.type === 'SELECT' ? formData.options.split(',').map(o => o.trim()) : null
            };
            await createCustomField(data);
            setShowModal(false);
            setFormData({ name: '', label: '', type: 'TEXT', module: 'USER', required: false, options: '' });
            loadFields();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to create field');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure? This will hide data for this field.')) {
            try {
                await deleteCustomField(id);
                loadFields();
            } catch (err) {
                alert('Failed to delete field');
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Custom Fields Settings</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Definition</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Label</th>
                        <th>Name (System)</th>
                        <th>Module</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map(field => (
                        <tr key={field.id}>
                            <td>{field.label}</td>
                            <td><code>{field.name}</code></td>
                            <td><span className="badge bg-secondary">{field.module}</span></td>
                            <td>{field.type}</td>
                            <td>{field.required ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(field.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {fields.length === 0 && !loading && <tr><td colSpan={6} className="text-center">No custom fields defined yet.</td></tr>}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Field Definition</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Label</Form.Label>
                            <Form.Control name="label" value={formData.label} onChange={handleChange} placeholder="e.g. Date of Birth" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>System Name (Unique Key)</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} placeholder="e.g. dob" required />
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Target Module</Form.Label>
                                <Form.Select name="module" value={formData.module} onChange={handleChange}>
                                    <option value="USER">User / Employee</option>
                                    <option value="SITE">Site / Location</option>
                                    <option value="COMPANY">Company</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Field Type</Form.Label>
                                <Form.Select name="type" value={formData.type} onChange={handleChange}>
                                    <option value="TEXT">Text</option>
                                    <option value="NUMBER">Number</option>
                                    <option value="DATE">Date</option>
                                    <option value="SELECT">Dropdown</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        {formData.type === 'SELECT' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Options (Comma separated)</Form.Label>
                                <Form.Control name="options" value={formData.options} onChange={handleChange} placeholder="Member, Leader, Guest" required />
                            </Form.Group>
                        )}
                        <Form.Check
                            type="checkbox"
                            name="required"
                            label="Required Field"
                            checked={formData.required}
                            onChange={handleChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Create Definition</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomFields;
