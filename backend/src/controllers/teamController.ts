import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTeams = async (req: AuthRequest, res: Response) => {
    try {
        const teams = await prisma.team.findMany({
            where: {
                companies: {
                    some: {
                        accountId: req.user?.accountId
                    }
                }
            },
            include: {
                companies: true,
                employees: true,
            },
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
    const { name, companyIds } = req.body;
    if (!name) return res.status(400).json({ error: 'Team name is required' });

    try {
        const team = await prisma.team.create({
            data: {
                name,
                companies: {
                    connect: companyIds?.map((id: string) => ({ id })) || [],
                },
            },
        });
        res.status(201).json(team);
    } catch (error: any) {
        console.error('Create team error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A team with this name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create team' });
    }
};
