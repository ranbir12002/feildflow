import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';
import { handleCustomFields } from '../utils/customFieldUtils';

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { accountId: req.user?.accountId },
            include: {
                role: true,
                companies: true,
                teams: true,
            },
        });

        const usersWithFields = await Promise.all(users.map(async (user: any) => {
            const fieldValues = await prisma.customFieldValue.findMany({
                where: { entityId: user.id },
                include: { customField: true }
            });
            return { ...user, customFields: fieldValues };
        }));

        res.json(usersWithFields);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, roleId, companyIds, teamIds, customFields } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: fullName || null,
                roleId,
                accountId: req.user!.accountId,
                companies: {
                    connect: companyIds?.map((id: string) => ({ id })) || [],
                },
                teams: {
                    connect: teamIds?.map((id: string) => ({ id })) || [],
                },
            },
            include: {
                role: true,
                companies: true,
                teams: true,
            }
        });

        if (customFields) {
            await handleCustomFields(user.id, customFields);
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error: any) {
        console.error('Create user error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { email, name, firstName, lastName, roleId, companyIds, teamIds, password, customFields } = req.body;

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();

    try {
        const updateData: any = {
            email,
            name: fullName || undefined,
            roleId: roleId || undefined,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id, accountId: req.user!.accountId },
            data: {
                ...updateData,
                companies: companyIds ? {
                    set: companyIds.map((id: string) => ({ id }))
                } : undefined,
                teams: teamIds ? {
                    set: teamIds.map((id: string) => ({ id }))
                } : undefined,
            },
            include: {
                role: true,
                companies: true,
                teams: true,
            }
        });

        if (customFields) {
            await handleCustomFields(user.id, customFields);
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error: any) {
        console.error('Update user error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already in use by another user.' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id, accountId: req.user!.accountId }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
