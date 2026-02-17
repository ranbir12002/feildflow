import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getRoles = async (req: AuthRequest, res: Response) => {
    try {
        const roles = await prisma.role.findMany({
            where: { accountId: req.user?.accountId },
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

export const createRole = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Role name is required' });

    try {
        const role = await prisma.role.create({
            data: {
                name,
                accountId: req.user!.accountId,
            },
        });
        res.status(201).json(role);
    } catch (error: any) {
        console.error('Create role error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A role with this name already exists in your account.' });
        }
        res.status(500).json({ error: 'Failed to create role' });
    }
};
