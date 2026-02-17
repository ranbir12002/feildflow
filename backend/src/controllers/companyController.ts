import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCompanies = async (req: AuthRequest, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            where: { accountId: req.user?.accountId },
            include: {
                teams: true,
                employees: true,
            },
        });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};

export const createCompany = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Company name is required' });

    try {
        const company = await prisma.company.create({
            data: {
                name,
                accountId: req.user!.accountId,
            },
        });
        res.status(201).json(company);
    } catch (error: any) {
        console.error('Create company error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A company with this name already exists in your account.' });
        }
        res.status(500).json({ error: 'Failed to create company' });
    }
};
