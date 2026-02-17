import React, { useState } from 'react';
import { Card, Button, Form, Alert, Image } from 'react-bootstrap';
import { uploadFile } from '../api/apiService';

const ImageUploadDemo: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const res = await uploadFile(file);
            setUploadedUrl(res.data.url);
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="mb-4">
            <Card.Header>Cloudflare R2 Image Upload Demo</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {uploadedUrl && (
                    <div className="mb-3">
                        <p className="text-success">Uploaded successfully!</p>
                        <Image src={uploadedUrl} thumbnail style={{ maxWidth: '200px' }} />
                        <div className="mt-2">
                            <small className="text-muted">{uploadedUrl}</small>
                        </div>
                    </div>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Select Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload to R2'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ImageUploadDemo;
