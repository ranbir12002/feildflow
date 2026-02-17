import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCustomFields = async (req: AuthRequest, res: Response) => {
    const { module } = req.query;
    try {
        const fields = await prisma.customField.findMany({
            where: {
                accountId: req.user!.accountId,
                module: module ? String(module) : undefined
            }
        });
        res.json(fields);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch custom fields' });
    }
};

export const createCustomField = async (req: AuthRequest, res: Response) => {
    const { name, label, type, options, module, required } = req.body;

    if (!name || !label || !type || !module) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const field = await prisma.customField.create({
            data: {
                name,
                label,
                type,
                options,
                module,
                required: required || false,
                accountId: req.user!.accountId
            }
        });
        res.status(201).json(field);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A field with this name already exists for this module.' });
        }
        res.status(500).json({ error: 'Failed to create custom field' });
    }
};

export const deleteCustomField = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const fieldId = String(id);
        // Warning: This will cascade delete values if we set up relations that way or handle manually
        await prisma.customFieldValue.deleteMany({ where: { customFieldId: fieldId } });
        await prisma.customField.delete({
            where: { id: fieldId, accountId: req.user!.accountId }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete custom field' });
    }
};
