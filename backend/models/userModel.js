const prisma = require('../prismaClient');

const login = async ({ username, password }) => {
    const user = await prisma.user.findFirst({
        where: {
            AND: [
                { OR: [{ nickname: username }, { email: username }] },
                { password }
            ]
        },
        select: { user_id: true, role: true, nickname: true, email: true }
    });
    return user || null;
};

const getAllAccounts = async () => {
    return prisma.user.findMany({
        select: { user_id: true, nickname: true, email: true, role: true, creationDate: true },
        orderBy: { user_id: 'asc' }
    });
};

const getAccountByUsernameOrEmail = async (username) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ nickname: username }, { email: username }] },
        select: { user_id: true, nickname: true, email: true, password: true, role: true }
    });
    return user || null;
};

const getAccountById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { user_id: Number(userId) },
        select: { user_id: true, nickname: true, email: true, password: true, role: true }
    });
    return user || null;
};

const createAccount = async ({ nickname, email, password, role }) => {
    await prisma.user.create({ data: { nickname, email, password, role } });
};

const updateAccount = async ({ user_id, nickname, email, password, role }) => {
    await prisma.user.update({
        where: { user_id: Number(user_id) },
        data: { nickname, email, password, role }
    });
};

const deleteAccount = async (userId) => {
    await prisma.user.delete({ where: { user_id: Number(userId) } });
};

const updateUserPreference = async ({ user_id, category, countChange, lastread }) => {
    const uid = Number(user_id);
    const existing = await prisma.userPreference.findUnique({ where: { user_id: uid } });

    if (existing) {
        const newCount = existing.count + countChange;
        if (newCount <= 0) {
            await prisma.userPreference.delete({ where: { user_id: uid } });
        } else {
            await prisma.userPreference.update({
                where: { user_id: uid },
                data: { category, count: newCount, lastRead: lastread ? new Date(lastread) : new Date() }
            });
        }
    } else {
        await prisma.userPreference.create({
            data: { user_id: uid, category, count: countChange, lastRead: lastread ? new Date(lastread) : new Date() }
        });
    }
};

module.exports = {
    login,
    getAllAccounts,
    getAccountByUsernameOrEmail,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    updateUserPreference
};

module.exports = {
    login,
    getAllAccounts,
    getAccountByUsernameOrEmail,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    updateUserPreference
};
