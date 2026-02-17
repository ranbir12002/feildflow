import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { handleCustomFields } from '../utils/customFieldUtils';

export const getAllSites = async (req: AuthRequest, res: Response) => {
    try {
        const sites = await prisma.site.findMany({
            where: {
                company: {
                    accountId: req.user?.accountId
                }
            },
            include: {
                company: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const sitesWithFields = await Promise.all(sites.map(async (site: any) => {
            const fieldValues = await prisma.customFieldValue.findMany({
                where: { entityId: site.id },
                include: { customField: true }
            });
            return { ...site, customFields: fieldValues };
        }));

        res.json(sitesWithFields);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all sites' });
    }
};

export const getSites = async (req: AuthRequest, res: Response) => {
    const { companyId } = req.params;
    try {
        const cId = String(companyId);
        const sites = await prisma.site.findMany({
            where: {
                companyId: cId,
                company: {
                    accountId: req.user?.accountId
                }
            }
        });

        const sitesWithFields = await Promise.all(sites.map(async (site: any) => {
            const fieldValues = await prisma.customFieldValue.findMany({
                where: { entityId: site.id },
                include: { customField: true }
            });
            return { ...site, customFields: fieldValues };
        }));

        res.json(sitesWithFields);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sites' });
    }
};

export const createSite = async (req: AuthRequest, res: Response) => {
    const { companyId } = req.params;
    const {
        name,
        address,
        billingAddress,
        billingContact,
        primaryContact,
        publicNotes,
        privateNotes,
        zone,
        preferredTechs,
        customers,
        archived,
        stcZone,
        veecZone,
        rates,
        customFields
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Site name is required' });

    try {
        const cId = String(companyId);
        const company = await prisma.company.findFirst({
            where: { id: cId, accountId: req.user?.accountId }
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found or access denied' });
        }

        const site = await prisma.site.create({
            data: {
                name,
                address,
                billingAddress,
                billingContact,
                primaryContact,
                publicNotes,
                privateNotes,
                zone,
                preferredTechs: preferredTechs || [],
                customers: customers || [],
                archived: archived || false,
                stcZone,
                veecZone,
                rates,
                companyId: cId
            }
        });

        if (customFields) {
            await handleCustomFields(site.id, customFields);
        }

        res.status(201).json(site);
    } catch (error: any) {
        console.error('Create site error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A site with this name already exists in this company.' });
        }
        res.status(500).json({ error: 'Failed to create site' });
    }
};
