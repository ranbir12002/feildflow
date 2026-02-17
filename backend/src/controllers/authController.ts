import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const signup = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, accountName, companyName } = req.body;
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    console.log('Signup attempt:', { email, fullName, accountName, companyName });

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Account and User in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Create Account
            console.log('Creating account...');
            const account = await tx.account.create({
                data: {
                    email,
                    name: accountName || `${fullName || 'New User'}'s Account`,
                },
            });

            // 2. Create 'ADMIN' Role for this Account
            console.log('Creating ADMIN role...');
            const adminRole = await tx.role.create({
                data: {
                    name: 'ADMIN',
                    accountId: account.id,
                },
            });

            // 3. Create User as ADMIN
            console.log('Creating user...');
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: fullName || null,
                    roleId: adminRole.id,
                    accountId: account.id,
                },
            });

            // 4. Create initial Company for this Account
            if (companyName) {
                console.log('Creating initial company...');
                await tx.company.create({
                    data: {
                        name: companyName,
                        accountId: account.id,
                    },
                });
            }

            return { user, account, role: adminRole };
        });

        console.log('Signup successful for:', email);

        const token = jwt.sign(
            { userId: result.user.id, accountId: result.account.id, role: result.role.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.role.name,
                accountId: result.account.id,
            },
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        res.status(500).json({ error: 'Internal server error during signup' });
    }
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { account: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, accountId: user.accountId, role: user.role?.name || 'USER' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role?.name || 'USER',
                accountId: user.accountId,
            },
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error during signin' });
    }
};
