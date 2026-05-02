const prisma = require('../prismaClient');

const logBorrow = async ({ user_id, res_id, borrow_date, return_date, status }) => {
    await prisma.borrowRecord.create({
        data: {
            user_id: Number(user_id),
            res_id: Number(res_id),
            borrow_date: borrow_date ? new Date(borrow_date) : new Date(),
            return_date: return_date ? new Date(return_date) : null,
            status
        }
    });
};

const getBorrowLogs = async (userId) => {
    const where = userId ? { user_id: Number(userId) } : {};
    const records = await prisma.borrowRecord.findMany({
        where,
        include: {
            user: { select: { nickname: true, email: true } },
            resource: { select: { title: true, author: true } }
        },
        orderBy: { borrow_date: 'desc' }
    });
    return records.map(r => ({
        borrow_id: r.borrow_id,
        user_id: r.user_id,
        res_id: r.res_id,
        borrow_date: r.borrow_date,
        return_date: r.return_date,
        status: r.status,
        nickname: r.user.nickname,
        email: r.user.email,
        title: r.resource.title,
        author: r.resource.author
    }));
};

const updateBorrow = async ({ borrow_id, user_id, res_id, borrow_date, return_date, status }) => {
    await prisma.borrowRecord.update({
        where: { borrow_id: Number(borrow_id) },
        data: {
            user_id: Number(user_id),
            res_id: Number(res_id),
            borrow_date: borrow_date ? new Date(borrow_date) : undefined,
            return_date: return_date ? new Date(return_date) : null,
            status
        }
    });
};

const deleteBorrow = async (borrowId) => {
    await prisma.borrowRecord.delete({ where: { borrow_id: Number(borrowId) } });
};

const log = async ({ user_id, action, timestamp }) => {
    await prisma.systemLog.create({
        data: {
            user_id: Number(user_id),
            action,
            timestamp: timestamp ? new Date(timestamp) : new Date()
        }
    });
};

const getLogs = async () => {
    return prisma.systemLog.findMany();
};

module.exports = {
    logBorrow,
    getBorrowLogs,
    updateBorrow,
    deleteBorrow,
    log,
    getLogs
};
