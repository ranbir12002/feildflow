import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../lib/s3Client';
import crypto from 'crypto';

export const getPresignedUrl = async (req: Request, res: Response) => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueFileName,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.status(200).json({
            uploadUrl: presignedUrl,
            publicUrl: `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`,
            fileName: uniqueFileName
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
};

export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3Client.send(command);

        const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        res.status(200).json({
            message: 'File uploaded successfully',
            url: publicUrl,
            fileName: fileName
        });
    } catch (error) {
        console.error('R2 Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload file to storage' });
    }
};
