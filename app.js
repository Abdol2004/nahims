const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'nahims-sw-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// DB helpers
const DB_PATH = path.join(__dirname, 'data/db.json');
function getDB() { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function saveDB(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

// Auth middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
}

// Make db available to all views
app.use((req, res, next) => {
  res.locals.isAdmin = req.session && req.session.admin;
  next();
});

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/images', req.uploadFolder || 'general');
    fs.ensureDirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==================== PUBLIC ROUTES ====================

// Home
app.get('/', (req, res) => {
  const db = getDB();
  res.render('index', {
    db,
    page: 'home',
    featuredEvents: db.events.filter(e => e.featured && e.published).slice(0, 4),
    latestNews: db.news.filter(n => n.published).slice(0, 3)
  });
});

// Sports
app.get('/sports', (req, res) => {
  const db = getDB();
  res.render('sports', { db, page: 'sports' });
});

// Academic
app.get('/academic', (req, res) => {
  const db = getDB();
  res.render('academic', { db, page: 'academic' });
});

// News
app.get('/news', (req, res) => {
  const db = getDB();
  res.render('news', { db, page: 'news', articles: db.news.filter(n => n.published) });
});

app.get('/news/:slug', (req, res) => {
  const db = getDB();
  const article = db.news.find(n => n.slug === req.params.slug && n.published);
  if (!article) return res.redirect('/news');
  res.render('news-single', { db, page: 'news', article });
});

// Events
app.get('/events/:slug', (req, res) => {
  const db = getDB();
  const event = db.events.find(e => e.slug === req.params.slug && e.published);
  if (!event) return res.redirect('/');
  res.render('event-single', { db, page: 'events', event });
});

// Chapters
app.get('/chapters', (req, res) => {
  const db = getDB();
  res.render('chapters', { db, page: 'chapters' });
});

// Blog
app.get('/blog', (req, res) => {
  const db = getDB();
  res.render('blog', { db, page: 'blog' });
});

// ==================== ADMIN ROUTES ====================

app.get('/admin/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const db = getDB();
  const { username, password } = req.body;
  if (username === db.admin.username) {
    const valid = await bcrypt.compare(password, db.admin.password);
    if (valid) {
      req.session.admin = true;
      req.session.adminName = db.admin.name;
      return res.redirect('/admin');
    }
  }
  res.render('admin/login', { error: 'Invalid username or password' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/dashboard', { db, adminName: req.session.adminName });
});

// Admin: Site Settings
app.get('/admin/settings', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/settings', { db, success: null });
});

app.post('/admin/settings', requireAdmin, (req, res) => {
  const db = getDB();
  db.site.email = req.body.email;
  db.site.phone = req.body.phone;
  db.site.twitter = req.body.twitter;
  db.site.instagram = req.body.instagram;
  db.site.facebook = req.body.facebook;
  db.site.stats.chapters = req.body.statChapters;
  db.site.stats.members = req.body.statMembers;
  db.site.stats.states = req.body.statStates;
  db.site.stats.years = req.body.statYears;
  db.announcements = req.body.announcements.split('\n').filter(a => a.trim());
  saveDB(db);
  res.render('admin/settings', { db, success: 'Settings saved successfully!' });
});

// Admin: Executives
app.get('/admin/executives', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/executives', { db, success: req.query.success });
});

app.post('/admin/executives/add', requireAdmin, (req, _uploadReq, next) => { req.uploadFolder = 'executives'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const newId = db.executives.length ? Math.max(...db.executives.map(e => e.id)) + 1 : 1;
  db.executives.push({
    id: newId,
    name: req.body.name,
    position: req.body.position,
    school: req.body.school,
    initials: req.body.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(),
    color: '#0B6E4F',
    image: req.file ? '/images/executives/' + req.file.filename : ''
  });
  saveDB(db);
  res.redirect('/admin/executives?success=Executive added');
});

app.post('/admin/executives/update/:id', requireAdmin, (req, res, next) => { req.uploadFolder = 'executives'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const exec = db.executives.find(e => e.id == req.params.id);
  if (exec) {
    exec.name = req.body.name;
    exec.position = req.body.position;
    exec.school = req.body.school;
    exec.initials = req.body.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
    if (req.file) exec.image = '/images/executives/' + req.file.filename;
    saveDB(db);
  }
  res.redirect('/admin/executives?success=Executive updated');
});

app.post('/admin/executives/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.executives = db.executives.filter(e => e.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/executives?success=Executive removed');
});

// Admin: Events
app.get('/admin/events', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/events', { db, success: req.query.success });
});

app.get('/admin/events/new', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/event-form', { db, event: null, action: '/admin/events/add' });
});

app.get('/admin/events/edit/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const event = db.events.find(e => e.id == req.params.id);
  if (!event) return res.redirect('/admin/events');
  res.render('admin/event-form', { db, event, action: `/admin/events/update/${event.id}` });
});

app.post('/admin/events/add', requireAdmin, (req, res, next) => { req.uploadFolder = 'events'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const newId = db.events.length ? Math.max(...db.events.map(e => e.id)) + 1 : 1;
  db.events.push({
    id: newId,
    title: req.body.title,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + newId,
    category: req.body.category,
    organizer: req.body.organizer,
    organizerRole: req.body.organizerRole,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    fullContent: req.body.fullContent,
    image: req.file ? '/images/events/' + req.file.filename : '',
    featured: req.body.featured === 'on',
    published: req.body.published === 'on'
  });
  saveDB(db);
  res.redirect('/admin/events?success=Event added');
});

app.post('/admin/events/update/:id', requireAdmin, (req, res, next) => { req.uploadFolder = 'events'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const event = db.events.find(e => e.id == req.params.id);
  if (event) {
    event.title = req.body.title;
    event.category = req.body.category;
    event.organizer = req.body.organizer;
    event.organizerRole = req.body.organizerRole;
    event.date = req.body.date;
    event.location = req.body.location;
    event.description = req.body.description;
    event.fullContent = req.body.fullContent;
    event.featured = req.body.featured === 'on';
    event.published = req.body.published === 'on';
    if (req.file) event.image = '/images/events/' + req.file.filename;
    saveDB(db);
  }
  res.redirect('/admin/events?success=Event updated');
});

app.post('/admin/events/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.events = db.events.filter(e => e.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/events?success=Event deleted');
});

// Admin: News
app.get('/admin/news', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/news', { db, success: req.query.success });
});

app.get('/admin/news/new', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/news-form', { db, article: null, action: '/admin/news/add' });
});

app.get('/admin/news/edit/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const article = db.news.find(n => n.id == req.params.id);
  if (!article) return res.redirect('/admin/news');
  res.render('admin/news-form', { db, article, action: `/admin/news/update/${article.id}` });
});

app.post('/admin/news/add', requireAdmin, (req, res, next) => { req.uploadFolder = 'news'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const newId = db.news.length ? Math.max(...db.news.map(n => n.id)) + 1 : 1;
  db.news.push({
    id: newId,
    title: req.body.title,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + newId,
    category: req.body.category,
    date: req.body.date || new Date().toISOString().split('T')[0],
    author: req.body.author,
    excerpt: req.body.excerpt,
    content: req.body.content,
    image: req.file ? '/images/news/' + req.file.filename : '',
    published: req.body.published === 'on'
  });
  saveDB(db);
  res.redirect('/admin/news?success=Article added');
});

app.post('/admin/news/update/:id', requireAdmin, (req, res, next) => { req.uploadFolder = 'news'; next(); }, upload.single('image'), (req, res) => {
  const db = getDB();
  const article = db.news.find(n => n.id == req.params.id);
  if (article) {
    article.title = req.body.title;
    article.category = req.body.category;
    article.date = req.body.date;
    article.author = req.body.author;
    article.excerpt = req.body.excerpt;
    article.content = req.body.content;
    article.published = req.body.published === 'on';
    if (req.file) article.image = '/images/news/' + req.file.filename;
    saveDB(db);
  }
  res.redirect('/admin/news?success=Article updated');
});

app.post('/admin/news/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.news = db.news.filter(n => n.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/news?success=Article deleted');
});

// Admin: Chapters
app.get('/admin/chapters', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/chapters', { db, success: req.query.success });
});

app.post('/admin/chapters/update/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const chapter = db.chapters.find(c => c.id == req.params.id);
  if (chapter) {
    chapter.school = req.body.school;
    chapter.state = req.body.state;
    chapter.president = req.body.president;
    chapter.phone = req.body.phone;
    chapter.email = req.body.email;
    chapter.due = req.body.due;
    saveDB(db);
  }
  res.redirect('/admin/chapters?success=Chapter updated');
});

app.post('/admin/chapters/add', requireAdmin, (req, res) => {
  const db = getDB();
  const newId = db.chapters.length ? Math.max(...db.chapters.map(c => c.id)) + 1 : 1;
  db.chapters.push({
    id: newId,
    school: req.body.school,
    state: req.body.state,
    president: req.body.president,
    phone: req.body.phone,
    email: req.body.email,
    due: req.body.due,
    founded: req.body.founded || new Date().getFullYear().toString()
  });
  saveDB(db);
  res.redirect('/admin/chapters?success=Chapter added');
});

app.post('/admin/chapters/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.chapters = db.chapters.filter(c => c.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/chapters?success=Chapter removed');
});

// Admin: Sports
app.get('/admin/sports', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/sports', { db, success: req.query.success });
});

app.post('/admin/sports/league/update', requireAdmin, (req, res) => {
  const db = getDB();
  const teams = req.body.team;
  if (Array.isArray(teams)) {
    db.sportLeague = teams.map((team, i) => ({
      pos: i + 1,
      team,
      p: parseInt(req.body.p[i]) || 0,
      w: parseInt(req.body.w[i]) || 0,
      d: parseInt(req.body.d[i]) || 0,
      l: parseInt(req.body.l[i]) || 0,
      gf: parseInt(req.body.gf[i]) || 0,
      ga: parseInt(req.body.ga[i]) || 0,
      pts: (parseInt(req.body.w[i]) || 0) * 3 + (parseInt(req.body.d[i]) || 0),
      form: (req.body.form[i] || '').split(',').map(f => f.trim()).filter(Boolean)
    }));
    saveDB(db);
  }
  res.redirect('/admin/sports?success=League table updated');
});

app.post('/admin/sports/fixture/add', requireAdmin, (req, res) => {
  const db = getDB();
  const newId = db.fixtures.length ? Math.max(...db.fixtures.map(f => f.id)) + 1 : 1;
  db.fixtures.push({ id: newId, ...req.body, matchday: parseInt(req.body.matchday), status: 'upcoming' });
  saveDB(db);
  res.redirect('/admin/sports?success=Fixture added');
});

app.post('/admin/sports/fixture/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.fixtures = db.fixtures.filter(f => f.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/sports?success=Fixture deleted');
});

app.post('/admin/sports/result/add', requireAdmin, (req, res) => {
  const db = getDB();
  const newId = db.results.length ? Math.max(...db.results.map(r => r.id)) + 1 : 1;
  db.results.push({ id: newId, ...req.body, homeScore: parseInt(req.body.homeScore), awayScore: parseInt(req.body.awayScore), matchday: parseInt(req.body.matchday) });
  saveDB(db);
  res.redirect('/admin/sports?success=Result added');
});

// Admin: Materials
app.get('/admin/materials', requireAdmin, (req, res) => {
  const db = getDB();
  res.render('admin/materials', { db, success: req.query.success });
});

app.post('/admin/materials/add', requireAdmin, (req, res, next) => { req.uploadFolder = 'materials'; next(); }, upload.single('file'), (req, res) => {
  const db = getDB();
  const newId = db.materials.length ? Math.max(...db.materials.map(m => m.id)) + 1 : 1;
  db.materials.push({
    id: newId,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    icon: req.body.icon || 'file-text',
    file: req.file ? '/images/materials/' + req.file.filename : ''
  });
  saveDB(db);
  res.redirect('/admin/materials?success=Material added');
});

app.post('/admin/materials/delete/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.materials = db.materials.filter(m => m.id != req.params.id);
  saveDB(db);
  res.redirect('/admin/materials?success=Material deleted');
});

// Admin: Change Password
app.post('/admin/settings/password', requireAdmin, async (req, res) => {
  const db = getDB();
  const { currentPassword, newPassword } = req.body;
  const valid = await bcrypt.compare(currentPassword, db.admin.password);
  if (!valid) return res.render('admin/settings', { db, success: null, error: 'Current password is incorrect' });
  db.admin.password = await bcrypt.hash(newPassword, 10);
  saveDB(db);
  res.render('admin/settings', { db, success: 'Password changed successfully!' });
});

app.listen(PORT, () => {
  console.log(`\n✅ NAHIMS SW running at http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`   Username: admin | Password: admin123\n`);
});
