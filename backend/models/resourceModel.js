const prisma = require('../prismaClient');

const addResource = async ({ title, author, description, availability }) => {
    const resource = await prisma.resource.create({
        data: { title, author, description, availability: availability || 'Available' }
    });
    return resource.res_id;
};

const getResources = async () => {
    const resources = await prisma.resource.findMany({
        include: { category: true },
        orderBy: { res_id: 'asc' }
    });
    const seen = new Map();
    const result = [];
    for (const r of resources) {
        const key = r.title + '||' + r.author;
        if (!seen.has(key)) {
            seen.set(key, true);
            result.push({
                res_id: r.res_id,
                title: r.title,
                author: r.author,
                description: r.description,
                availability: r.availability,
                category: r.category ? r.category.category : null
            });
        }
    }
    return result;
};

const updateResource = async ({ res_id, title, author, description, availability }) => {
    await prisma.resource.update({
        where: { res_id: Number(res_id) },
        data: { title, author, description, availability }
    });
};

const deleteResource = async (resId) => {
    await prisma.resource.delete({ where: { res_id: Number(resId) } });
};

const addCategory = async ({ res_id, category }) => {
    await prisma.resourceCategory.create({ data: { res_id: Number(res_id), category } });
};

const getCategories = async () => {
    return prisma.resourceCategory.findMany();
};

const updateCategory = async ({ res_id, category }) => {
    await prisma.resourceCategory.update({
        where: { res_id: Number(res_id) },
        data: { category }
    });
};

const deleteCategory = async (resId) => {
    await prisma.resourceCategory.delete({ where: { res_id: Number(resId) } });
};

const addBookmark = async ({ user_id, res_id }) => {
    await prisma.bookmark.create({ data: { user_id: Number(user_id), res_id: Number(res_id) } });
};

const getBookmarks = async (userId) => {
    const bookmarks = await prisma.bookmark.findMany({
        where: { user_id: Number(userId) },
        include: { resource: true },
        orderBy: { bm_id: 'asc' }
    });
    return bookmarks.map(b => ({
        bm_id: b.bm_id,
        user_id: b.user_id,
        res_id: b.res_id,
        title: b.resource.title,
        author: b.resource.author,
        availability: b.resource.availability
    }));
};

const deleteBookmark = async (bmId) => {
    await prisma.bookmark.delete({ where: { bm_id: Number(bmId) } });
};

const borrowResource = async ({ user_id, res_id }) => {
    const uid = Number(user_id);
    const rid = Number(res_id);

    const resource = await prisma.resource.findUnique({ where: { res_id: rid } });
    if (!resource) throw new Error('Resource not found');
    if (resource.availability !== 'Available') throw new Error('Resource is currently unavailable');

    await prisma.borrowRecord.create({
        data: {
            user_id: uid,
            res_id: rid,
            borrow_date: new Date(),
            return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'Borrowed'
        }
    });

    await prisma.resource.update({ where: { res_id: rid }, data: { availability: 'Unavailable' } });
    await prisma.systemLog.create({ data: { user_id: uid, action: 'Borrowed ' + resource.title } });
};

const returnResource = async ({ user_id, res_id }) => {
    const uid = Number(user_id);
    const rid = Number(res_id);

    const borrow = await prisma.borrowRecord.findFirst({
        where: { user_id: uid, res_id: rid, status: 'Borrowed' },
        orderBy: { borrow_date: 'desc' }
    });
    if (!borrow) throw new Error('No active borrow record found for this user and resource');

    await prisma.borrowRecord.update({
        where: { borrow_id: borrow.borrow_id },
        data: { status: 'Returned', return_date: new Date() }
    });

    await prisma.resource.update({ where: { res_id: rid }, data: { availability: 'Available' } });

    const resource = await prisma.resource.findUnique({ where: { res_id: rid } });
    const title = resource ? resource.title : 'resource #' + rid;
    await prisma.systemLog.create({ data: { user_id: uid, action: 'Returned ' + title } });
};

module.exports = {
    addResource, getResources, updateResource, deleteResource,
    addCategory, getCategories, updateCategory, deleteCategory,
    addBookmark, getBookmarks, deleteBookmark,
    borrowResource, returnResource
};
