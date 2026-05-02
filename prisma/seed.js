const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Users ────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'nguyenvana@gmail.com' }, update: {}, create: { nickname: 'Nguyen Van A', email: 'nguyenvana@gmail.com', password: 'nguyevana123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'tranthib@gmail.com' }, update: {}, create: { nickname: 'Tran Thi B', email: 'tranthib@gmail.com', password: 'tranthib123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'leminhc@gmail.com' }, update: {}, create: { nickname: 'Le Minh C', email: 'leminhc@gmail.com', password: 'leminhc123', role: 'Admin' } }),
    prisma.user.upsert({ where: { email: 'phamquocd@gmail.com' }, update: {}, create: { nickname: 'Pham Quoc D', email: 'phamquocd@gmail.com', password: 'phamquocd123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'vongoce@gmail.com' }, update: {}, create: { nickname: 'Vo Ngoc E', email: 'vongoce@gmail.com', password: 'vongoce123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'buithanhf@gmail.com' }, update: {}, create: { nickname: 'Bui Thanh F', email: 'buithanhf@gmail.com', password: 'buithanhf123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'domaig@gmail.com' }, update: {}, create: { nickname: 'Do Mai G', email: 'domaig@gmail.com', password: 'domaig123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'ngoduch@gmail.com' }, update: {}, create: { nickname: 'Ngo Duc H', email: 'ngoduch@gmail.com', password: 'ngoduch123', role: 'User' } }),
    prisma.user.upsert({ where: { email: 'phamnhati@gmail.com' }, update: {}, create: { nickname: 'Pham Nhat I', email: 'phamnhati@gmail.com', password: 'phamnhati123', role: 'Admin' } }),
    prisma.user.upsert({ where: { email: 'hoanglinhj@gmail.com' }, update: {}, create: { nickname: 'Hoang Linh J', email: 'hoanglinhj@gmail.com', password: 'hoanglinhj123', role: 'User' } }),
  ]);
  console.log(`Created ${users.length} users`);

  // ── Resources ────────────────────────────────────────────────────────────
  const resourceData = [
    { title: 'Database Fundamentals', author: 'Thomas Connolly', description: 'Introduction to database systems', category: 'Database' },
    { title: 'Python for Data Analysis', author: 'Wes McKinney', description: 'Data analysis using Python', category: 'Programming' },
    { title: 'Machine Learning Basics', author: 'Andrew Ng', description: 'Basic concepts of machine learning', category: 'AI' },
    { title: 'Operating System Concepts', author: 'Silberschatz', description: 'OS principles', category: 'Computer Science' },
    { title: 'Web Development with HTML CSS', author: 'Jon Duckett', description: 'Frontend web development', category: 'Web' },
    { title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship', category: 'Software Engineering' },
    { title: 'Design Patterns', author: 'Erich Gamma', description: 'Elements of reusable object-oriented software', category: 'Software Engineering' },
    { title: 'Deep Learning', author: 'Ian Goodfellow', description: 'Comprehensive deep learning foundations', category: 'AI' },
    { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', description: 'Classic introduction to networking concepts', category: 'Computer Science' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', description: 'Practical software engineering practices', category: 'Software Engineering' },
    { title: 'Refactoring', author: 'Martin Fowler', description: 'Improving design of existing code', category: 'Software Engineering' },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', description: 'Standard textbook for AI', category: 'AI' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', description: 'Core algorithms and data structures', category: 'Programming' },
    { title: 'Effective Java', author: 'Joshua Bloch', description: 'Best practices for Java programming', category: 'Programming' },
    { title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', description: 'Advanced operating systems concepts', category: 'Computer Science' },
  ];

  const resources = [];
  for (const r of resourceData) {
    const resource = await prisma.resource.upsert({
      where: { res_id: resourceData.indexOf(r) + 1 },
      update: {},
      create: {
        title: r.title,
        author: r.author,
        description: r.description,
        availability: 'Available',
        category: { create: { category: r.category } }
      }
    });
    resources.push({ ...resource, category: r.category });
  }
  console.log(`Created ${resources.length} resources`);

  // Helper to get resource id by title
  const resId = (title) => resources.find(r => r.title === title)?.res_id;

  // ── Bookmarks ────────────────────────────────────────────────────────────
  const bookmarkData = [
    { user_id: users[0].user_id, res_id: resId('Database Fundamentals') },
    { user_id: users[0].user_id, res_id: resId('Machine Learning Basics') },
    { user_id: users[1].user_id, res_id: resId('Python for Data Analysis') },
    { user_id: users[1].user_id, res_id: resId('Web Development with HTML CSS') },
    { user_id: users[2].user_id, res_id: resId('Clean Code') },
    { user_id: users[3].user_id, res_id: resId('Design Patterns') },
    { user_id: users[3].user_id, res_id: resId('Deep Learning') },
    { user_id: users[4].user_id, res_id: resId('Computer Networks') },
    { user_id: users[5].user_id, res_id: resId('The Pragmatic Programmer') },
  ];

  for (const b of bookmarkData) {
    await prisma.bookmark.create({ data: b }).catch(() => {});
  }
  console.log(`Created ${bookmarkData.length} bookmarks`);

  // ── Borrow Records ───────────────────────────────────────────────────────
  const borrowData = [
    { user_id: users[0].user_id, res_id: resId('Database Fundamentals'), borrow_date: new Date('2026-03-10'), return_date: null, status: 'Borrowed' },
    { user_id: users[0].user_id, res_id: resId('Machine Learning Basics'), borrow_date: new Date('2026-03-01'), return_date: new Date('2026-03-08'), status: 'Returned' },

    { user_id: users[1].user_id, res_id: resId('Python for Data Analysis'), borrow_date: new Date('2026-03-05'), return_date: null, status: 'Borrowed' },

    { user_id: users[2].user_id, res_id: resId('Clean Code'), borrow_date: new Date('2026-03-11'), return_date: null, status: 'Borrowed' },

    { user_id: users[3].user_id, res_id: resId('Design Patterns'), borrow_date: new Date('2026-03-12'), return_date: null, status: 'Borrowed' },
    { user_id: users[3].user_id, res_id: resId('Deep Learning'), borrow_date: new Date('2026-03-02'), return_date: new Date('2026-03-09'), status: 'Returned' },

    { user_id: users[4].user_id, res_id: resId('Computer Networks'), borrow_date: new Date('2026-03-13'), return_date: null, status: 'Borrowed' },

    { user_id: users[5].user_id, res_id: resId('The Pragmatic Programmer'), borrow_date: new Date('2026-03-14'), return_date: null, status: 'Borrowed' },

    { user_id: users[6].user_id, res_id: resId('Refactoring'), borrow_date: new Date('2026-03-15'), return_date: null, status: 'Borrowed' },

    { user_id: users[7].user_id, res_id: resId('Operating System Concepts'), borrow_date: new Date('2026-03-04'), return_date: new Date('2026-03-12'), status: 'Returned' },

    { user_id: users[8].user_id, res_id: resId('Effective Java'), borrow_date: new Date('2026-03-16'), return_date: null, status: 'Borrowed' },

    { user_id: users[9].user_id, res_id: resId('Artificial Intelligence: A Modern Approach'), borrow_date: new Date('2026-03-06'), return_date: null, status: 'Borrowed' },
  ];

  for (const b of borrowData) {
    await prisma.borrowRecord.create({ data: b });
  }
  console.log(`Created ${borrowData.length} borrow records`);

  // ── System Logs ──────────────────────────────────────────────────────────
  const logData = [
    { user_id: users[0].user_id, action: 'Login', timestamp: new Date('2026-03-15T08:00:00') },
    { user_id: users[0].user_id, action: 'Bookmarked resource 3', timestamp: new Date('2026-03-15T08:10:00') },
    { user_id: users[1].user_id, action: 'Borrowed resource 2', timestamp: new Date('2026-03-15T09:00:00') },
    { user_id: users[2].user_id, action: 'Updated resource information', timestamp: new Date('2026-03-15T10:00:00') },
  ];

  for (const l of logData) {
    await prisma.systemLog.create({ data: l });
  }
  console.log(`Created ${logData.length} system logs`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
