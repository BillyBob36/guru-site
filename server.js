/**
 * Guru — serveur Express
 *
 * Rôles :
 *  1. Servir le site statique (index.html, styles.css, script.js, fonts, images)
 *  2. Exposer une petite API pour l'admin photos :
 *       GET    /api/tags                 → renvoie tags.json
 *       PUT    /api/tags                 → remplace tags.json
 *       POST   /api/photos               → upload + enregistre une photo
 *       DELETE /api/photos/:filename     → supprime une photo du disque
 *       POST   /api/login                → valide le mot de passe admin
 *
 * Les photos + tags.json vivent dans un dossier /app/data monté en volume
 * persistant par Coolify, pour survivre aux redeploys.
 *
 * Auth : header `X-Admin-Token` comparé à la variable d'env ADMIN_PASSWORD.
 * Si ADMIN_PASSWORD n'est pas défini, l'API d'écriture est désactivée (503).
 */

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const fsp     = require('fs/promises');

const PORT           = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ROOT           = __dirname;
const DATA_DIR       = process.env.DATA_DIR || path.join(ROOT, 'gallery');
const TAGS_FILE      = path.join(DATA_DIR, 'tags.json');

// --- Seed le volume si vide (première exécution derrière un volume Docker) ---
function seedDataDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const seed = path.join(ROOT, 'gallery-seed');
    if (!fs.existsSync(seed)) return;
    const existing = fs.readdirSync(DATA_DIR);
    if (existing.length > 0) return;
    for (const f of fs.readdirSync(seed)) {
      fs.copyFileSync(path.join(seed, f), path.join(DATA_DIR, f));
    }
    console.log(`[seed] ${fs.readdirSync(DATA_DIR).length} fichiers copiés dans ${DATA_DIR}`);
  } catch (e) {
    console.warn('[seed] ignoré :', e.message);
  }
}
seedDataDir();

const app = express();
app.use(express.json({ limit: '2mb' }));

// --- Redirection 301 host-based vers le canonique ---
// Certains domaines secondaires (anciens noms commerciaux) pointent en DNS vers
// notre serveur mais ne doivent PAS afficher le site — ils doivent juste
// rediriger en 301 vers guruworld.group. On gère ça en amont du routeur Express
// pour que TOUT (HTTP+HTTPS, /admin-photos.html, /api/*, etc.) soit redirigé
// d'un coup. Le path et la query string d'origine sont préservés.
//
// Pourquoi pas via le redirecteur OVH (213.186.33.5) ? Parce que guru-paris.fr
// est encore rattaché à l'hébergement WP OVH et que celui-ci intercepte le
// trafic HTTPS pour servir l'ancien WordPress. En faisant pointer le DNS chez
// nous, on bypass complètement OVH et on contrôle 100% de la redirection.
const CANONICAL_URL  = 'https://guruworld.group';
const REDIRECT_HOSTS = new Set([
  'guru-paris.fr',
  'www.guru-paris.fr',
]);
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    return res.redirect(301, CANONICAL_URL + req.originalUrl);
  }
  next();
});

// --- Middleware d'auth pour toutes les routes d'écriture ---
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD non configuré côté serveur' });
  }
  const token = req.get('X-Admin-Token') || '';
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe invalide' });
  }
  next();
}

// --- Login : renvoie simplement OK si le mot de passe est bon ---
// Le client stocke ensuite le mot de passe en sessionStorage et l'envoie
// à chaque requête via le header X-Admin-Token.
app.post('/api/login', (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin non configuré' });
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Mot de passe invalide' });
  res.json({ ok: true });
});

// --- Lecture publique du tags.json (le site en a besoin) ---
app.get('/api/tags', async (req, res) => {
  try {
    const raw = await fsp.readFile(TAGS_FILE, 'utf8');
    res.type('application/json').send(raw);
  } catch {
    res.json([]);
  }
});

// --- Écriture du tags.json (admin) ---
app.put('/api/tags', requireAdmin, async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Corps attendu : tableau JSON' });
  try {
    await fsp.writeFile(TAGS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, count: data.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Écriture tags.json échouée' });
  }
});

// --- Upload photo ---
// Le client envoie un blob JPEG déjà recadré/redimensionné par l'admin.
// Le filename est choisi côté client (photo_<hash>.jpeg), on le sécurise ici.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

function safeFilename(name) {
  // Autorise uniquement lettres, chiffres, tiret, underscore, point.
  const base = path.basename(String(name || ''));
  if (!/^[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(base)) return null;
  return base;
}

app.post('/api/photos', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Fichier manquant (champ "file")' });
  const filename = safeFilename(req.body.filename || req.file.originalname);
  if (!filename) return res.status(400).json({ error: 'Nom de fichier invalide' });
  try {
    await fsp.writeFile(path.join(DATA_DIR, filename), req.file.buffer);
    res.json({ ok: true, filename });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Écriture fichier échouée' });
  }
});

// --- Suppression photo ---
app.delete('/api/photos/:filename', requireAdmin, async (req, res) => {
  const filename = safeFilename(req.params.filename);
  if (!filename) return res.status(400).json({ error: 'Nom de fichier invalide' });
  try {
    await fsp.unlink(path.join(DATA_DIR, filename));
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ENOENT') return res.status(404).json({ error: 'Fichier introuvable' });
    console.error(e);
    res.status(500).json({ error: 'Suppression échouée' });
  }
});

// --- Healthcheck pour Coolify ---
app.get('/healthz', (req, res) => res.json({ ok: true }));

// --- Servir les fichiers du dossier data (photos) à /gallery/* ---
// Le site continue d'appeler /gallery/photo_xxx.jpeg comme avant.
app.use('/gallery', express.static(DATA_DIR, {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    // tags.json doit toujours être frais (l'admin peut l'avoir modifié)
    if (path.basename(filePath) === 'tags.json') {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// --- Site statique : tout le reste ---
app.use(express.static(ROOT, {
  index: 'index.html',
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    // HTML/JS/CSS en dev : pas de cache agressif pour que les deploys soient visibles vite
    const ext = path.extname(filePath);
    if (['.html', '.js', '.css'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`[guru] server on :${PORT}  (data dir: ${DATA_DIR})`);
  if (!ADMIN_PASSWORD) console.warn('[guru] ⚠ ADMIN_PASSWORD non défini — API admin désactivée');
});
