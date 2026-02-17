import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchCustomFields } from '../api/apiService';

interface CustomFieldsViewProps {
    module: string;
    values: Record<string, any>;
    onChange: (fieldId: string, value: any) => void;
}

const CustomFieldsView: React.FC<CustomFieldsViewProps> = ({ module, values, onChange }) => {
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        fetchCustomFields(module).then(res => setFields(res.data)).catch(() => { });
    }, [module]);

    if (fields.length === 0) return null;

    return (
        <div className="mt-3">
            <hr />
            <h5>Additional Information</h5>
            {fields.map(field => (
                <Form.Group key={field.id} className="mb-3">
                    <Form.Label>{field.label}{field.required && <span className="text-danger">*</span>}</Form.Label>
                    {field.type === 'SELECT' ? (
                        <Form.Select
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            required={field.required}
                        >
                            <option value="">Select...</option>
                            {(field.options as string[])?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    ) : (
                        <Form.Control
                            type={field.type === 'DATE' ? 'date' : field.type === 'NUMBER' ? 'number' : 'text'}
                            value={values[field.id] || ''}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            required={field.required}
                        />
                    )}
                </Form.Group>
            ))}
        </div>
    );
};

export default CustomFieldsView;
