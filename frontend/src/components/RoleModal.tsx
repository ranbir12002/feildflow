import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createRole } from '../api/apiService';

interface RoleModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: {}
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
            await createRole(formData);
            onSuccess();
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Custom Role</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Role Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="e.g. Sales Manager"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            placeholder="What can this role do?"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <small className="text-muted">Detailed permission settings coming soon.</small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Role'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RoleModal;
