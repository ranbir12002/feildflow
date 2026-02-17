import { prisma } from '../lib/prisma';

export const handleCustomFields = async (entityId: string, customFields: Record<string, any>) => {
    if (!customFields) return;

    for (const [fieldId, value] of Object.entries(customFields)) {
        await prisma.customFieldValue.upsert({
            where: {
                customFieldId_entityId: {
                    customFieldId: fieldId,
                    entityId
                }
            },
            update: { value: String(value) },
            create: {
                value: String(value),
                customFieldId: fieldId,
                entityId
            }
        });
    }
};
