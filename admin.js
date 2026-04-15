/* ===== Guru — Admin Photos — Logic ===== */
(function () {
  'use strict';

  // ---- State ----
  let galleryData = [];          // Array of {photo, tags}
  let allTags = [];              // Unique tag list (from photos + tagsExtra)
  let tagsExtra = [];            // Tags créés mais pas encore utilisés
  let newPhotos = new Map();     // filename -> Blob (uploads en attente de POST)
  let uploadQueue = [];          // Pending upload cards
  const MAX_OUTPUT = 1200;       // Taille max côté long en sortie
  const JPEG_QUALITY = 0.85;

  // ============================================================
  // API client — communique avec le backend Express (server.js)
  // Token d'auth stocké en sessionStorage (purgé à la fermeture).
  // ============================================================
  const TOKEN_KEY = 'guru_admin_token';
  const api = {
    get token() { return sessionStorage.getItem(TOKEN_KEY) || ''; },
    set token(v) { v ? sessionStorage.setItem(TOKEN_KEY, v) : sessionStorage.removeItem(TOKEN_KEY); },

    async login(password) {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Échec login');
      this.token = password;
      return true;
    },

    async getTags() {
      const r = await fetch('/api/tags?v=' + Date.now(), { cache: 'no-store' });
      return r.ok ? r.json() : [];
    },

    async putTags(data) {
      const r = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': this.token },
        body: JSON.stringify(data)
      });
      if (r.status === 401) { requireLogin(); throw new Error('Session expirée'); }
      if (!r.ok) throw new Error('Sauvegarde tags.json échouée');
      return r.json();
    },

    async postPhoto(filename, blob) {
      const fd = new FormData();
      fd.append('file', blob, filename);
      fd.append('filename', filename);
      const r = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'X-Admin-Token': this.token },
        body: fd
      });
      if (r.status === 401) { requireLogin(); throw new Error('Session expirée'); }
      if (!r.ok) throw new Error('Upload photo échoué');
      return r.json();
    },

    async deletePhoto(filename) {
      const r = await fetch('/api/photos/' + encodeURIComponent(filename), {
        method: 'DELETE',
        headers: { 'X-Admin-Token': this.token }
      });
      if (r.status === 401) { requireLogin(); throw new Error('Session expirée'); }
      if (!r.ok && r.status !== 404) throw new Error('Suppression photo échouée');
      return true;
    }
  };

  // Indicateur visuel de synchronisation dans le header
  function syncStatus(state) {
    const el = document.getElementById('syncIndicator');
    if (!el) return;
    el.classList.remove('syncing', 'error');
    if (state === 'syncing') { el.classList.add('syncing'); el.textContent = '⟳ Sauvegarde...'; }
    else if (state === 'error') { el.classList.add('error'); el.textContent = '⚠ Erreur de sauvegarde'; }
    else el.textContent = '🔒 Sauvegarde auto';
  }

  // Sauvegarde tags.json (debounced) après chaque mutation
  let saveTimer = null;
  function persistTags() {
    clearTimeout(saveTimer);
    syncStatus('syncing');
    saveTimer = setTimeout(async () => {
      try {
        await api.putTags(galleryData);
        syncStatus('idle');
      } catch (e) {
        console.error(e);
        syncStatus('error');
        toast('Erreur de sauvegarde : ' + e.message);
      }
    }, 300);
  }

  function requireLogin() {
    api.token = '';
    document.getElementById('loginOverlay').classList.remove('hidden');
  }

  // ---- DOM refs ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const galleryGrid = document.getElementById('galleryGrid');
  const uploadGrid = document.getElementById('uploadGrid');
  const filterTag = document.getElementById('filterTag');
  const searchInput = document.getElementById('searchInput');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const modalOverlay = document.getElementById('modalOverlay');
  const toastEl = document.getElementById('toast');
  const tagsListEl = document.getElementById('tagsList');
  const tagAddInput = document.getElementById('tagAddInput');
  const tagAddBtn = document.getElementById('tagAddBtn');
  const lightbox = document.getElementById('adminLightbox');

  // ---- Init ----
  async function init() {
    try {
      galleryData = await api.getTags();
    } catch (e) {
      console.warn('Impossible de charger tags.json, on démarre avec une galerie vide.', e);
      galleryData = [];
    }
    rebuildAllTags();
    renderGallery();
    renderFilterDropdown();
    renderTagsList();
  }

  // ---- Login flow ----
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm    = document.getElementById('loginForm');
  const loginPwd     = document.getElementById('loginPassword');
  const loginErr     = document.getElementById('loginError');
  const loginSubmit  = document.getElementById('loginSubmit');

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    loginErr.hidden = true;
    loginSubmit.disabled = true;
    loginSubmit.textContent = 'Vérification...';
    try {
      await api.login(loginPwd.value);
      loginOverlay.classList.add('hidden');
      loginPwd.value = '';
      await init();
    } catch (err) {
      loginErr.textContent = err.message;
      loginErr.hidden = false;
    } finally {
      loginSubmit.disabled = false;
      loginSubmit.textContent = 'Se connecter';
    }
  });

  document.getElementById('btnLogout').addEventListener('click', () => {
    api.token = '';
    loginOverlay.classList.remove('hidden');
    loginPwd.focus();
  });

  // Si un token existe déjà en session, on tente directement d'initialiser.
  // Le 1er appel PUT/POST validera (ou reverra sur le login).
  if (api.token) {
    loginOverlay.classList.add('hidden');
    init();
  } else {
    // Permettre quand même la lecture publique en cas de visite directe sans login
    init();
  }

  // ---- Tag helpers ----
  function rebuildAllTags() {
    const set = new Set(tagsExtra);
    galleryData.forEach(item => (item.tags || []).forEach(t => set.add(t)));
    allTags = [...set].sort((a, b) => a.localeCompare(b, 'fr'));
  }

  function countTagUsage(tag) {
    let n = 0;
    for (const item of galleryData) if ((item.tags || []).includes(tag)) n++;
    return n;
  }

  // ---- Tabs ----
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // ========================================================
  // TAB 1 : GALERIE EXISTANTE
  // ========================================================
  function renderGallery() {
    const tagFilter = filterTag.value;
    const search = searchInput.value.trim().toLowerCase();

    const filtered = galleryData.filter(item => {
      if (tagFilter && !(item.tags || []).includes(tagFilter)) return false;
      if (search && !item.photo.toLowerCase().includes(search)) return false;
      return true;
    });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <p>Aucune photo trouvée.</p>
        </div>`;
      return;
    }

    galleryGrid.innerHTML = filtered.map(item => {
      const realIdx = galleryData.indexOf(item);
      const src = newPhotos.has(item.photo)
        ? URL.createObjectURL(newPhotos.get(item.photo))
        : 'gallery/' + item.photo;
      const tagsHTML = (item.tags || []).map(t => `<span class="tag-chip">${esc(t)}</span>`).join('');
      return `
        <div class="photo-card" data-idx="${realIdx}">
          <div class="photo-card-img" data-action="preview" data-src="${esc(src)}">
            <img src="${esc(src)}" alt="${esc(item.photo)}" loading="lazy">
          </div>
          <div class="photo-card-body">
            <div class="photo-card-filename">${esc(item.photo)}</div>
            <div class="photo-card-tags">${tagsHTML}</div>
            <div class="photo-card-actions">
              <button class="btn-icon" title="Modifier les tags" data-action="edit" data-idx="${realIdx}">&#9998;</button>
              <button class="btn-icon danger" title="Supprimer" data-action="delete" data-idx="${realIdx}">&#128465;</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function renderFilterDropdown() {
    const current = filterTag.value;
    filterTag.innerHTML = '<option value="">Tous les tags</option>' +
      allTags.map(t => `<option value="${esc(t)}" ${t === current ? 'selected' : ''}>${esc(t)}</option>`).join('');
  }

  filterTag.addEventListener('change', renderGallery);
  searchInput.addEventListener('input', renderGallery);

  // Delegate clicks on gallery grid
  galleryGrid.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;
    if (action === 'preview') openLightbox(t.dataset.src);
    else if (action === 'edit')   editTags(parseInt(t.dataset.idx, 10));
    else if (action === 'delete') deletePhoto(parseInt(t.dataset.idx, 10));
  });

  // ---- Lightbox ----
  function openLightbox(src) {
    lightbox.querySelector('img').src = src;
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('visible');
    document.body.style.overflow = '';
  }
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('admin-lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox();
  });

  // ---- Edit tags modal ----
  let editingIdx = null;
  let modalMode = null; // 'edit' | 'delete' | 'delete-tag'
  let pendingTagDelete = null;

  function editTags(idx) {
    modalMode = 'edit';
    editingIdx = idx;
    const item = galleryData[idx];
    const currentTags = new Set(item.tags || []);

    document.getElementById('modalTitle').textContent = 'Modifier les tags';
    document.getElementById('modalSubtitle').textContent = item.photo;
    document.getElementById('modalNewTagRow').style.display = '';
    document.getElementById('modalSave').textContent = 'Enregistrer';
    document.getElementById('modalSave').classList.remove('btn-delete-confirm');

    const tagListEl = document.getElementById('modalTagList');
    tagListEl.innerHTML = allTags.map(t => `
      <label><input type="checkbox" value="${esc(t)}" ${currentTags.has(t) ? 'checked' : ''}> ${esc(t)}</label>
    `).join('');

    document.getElementById('modalNewTagInput').value = '';
    modalOverlay.classList.add('visible');
  }

  document.getElementById('modalAddTag').addEventListener('click', () => {
    const input = document.getElementById('modalNewTagInput');
    const tag = input.value.trim();
    if (!tag) return;
    input.value = '';
    const tagListEl = document.getElementById('modalTagList');
    const existing = tagListEl.querySelector(`input[value="${CSS.escape(tag)}"]`);
    if (existing) { existing.checked = true; return; }
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${esc(tag)}" checked> ${esc(tag)}`;
    tagListEl.appendChild(label);
    if (!allTags.includes(tag)) { tagsExtra.push(tag); rebuildAllTags(); renderFilterDropdown(); renderTagsList(); }
  });

  document.getElementById('modalNewTagInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('modalAddTag').click(); }
  });

  document.getElementById('modalSave').addEventListener('click', async () => {
    if (modalMode === 'edit' && editingIdx !== null) {
      const checks = document.querySelectorAll('#modalTagList input[type="checkbox"]');
      const newTags = [];
      checks.forEach(c => { if (c.checked) newTags.push(c.value); });
      galleryData[editingIdx].tags = newTags;
      rebuildAllTags();
      renderFilterDropdown();
      renderGallery();
      renderTagsList();
      persistTags();
      toast('Tags mis à jour');
    } else if (modalMode === 'delete' && editingIdx !== null) {
      const item = galleryData[editingIdx];
      newPhotos.delete(item.photo);
      galleryData.splice(editingIdx, 1);
      rebuildAllTags();
      renderFilterDropdown();
      renderGallery();
      renderTagsList();
      // Persiste d'abord tags.json puis supprime le fichier côté serveur
      persistTags();
      try { await api.deletePhoto(item.photo); } catch (e) { console.warn(e); }
      toast('Photo supprimée');
    } else if (modalMode === 'delete-tag' && pendingTagDelete) {
      const tag = pendingTagDelete;
      galleryData.forEach(item => {
        if (item.tags) item.tags = item.tags.filter(t => t !== tag);
      });
      tagsExtra = tagsExtra.filter(t => t !== tag);
      rebuildAllTags();
      renderFilterDropdown();
      renderGallery();
      renderTagsList();
      persistTags();
      toast(`Tag « ${tag} » supprimé`);
      pendingTagDelete = null;
    }
    closeModal();
  });

  document.getElementById('modalCancel').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  function closeModal() {
    modalOverlay.classList.remove('visible');
    modalMode = null;
    editingIdx = null;
    pendingTagDelete = null;
  }

  // ---- Delete photo ----
  function deletePhoto(idx) {
    modalMode = 'delete';
    editingIdx = idx;
    const item = galleryData[idx];
    document.getElementById('modalTitle').textContent = 'Confirmer la suppression';
    document.getElementById('modalSubtitle').textContent = `Supprimer définitivement « ${item.photo} » ?`;
    document.getElementById('modalTagList').innerHTML = '';
    document.getElementById('modalNewTagRow').style.display = 'none';
    const saveBtn = document.getElementById('modalSave');
    saveBtn.textContent = 'Supprimer';
    saveBtn.classList.add('btn-delete-confirm');
    modalOverlay.classList.add('visible');
  }

  // ========================================================
  // TAB 3 : GESTION DES TAGS
  // ========================================================
  function renderTagsList() {
    if (allTags.length === 0) {
      tagsListEl.innerHTML = '<div class="empty-state"><p>Aucun tag pour le moment.</p></div>';
      return;
    }
    tagsListEl.innerHTML = allTags.map(tag => {
      const n = countTagUsage(tag);
      const usageLabel = n === 0 ? 'non utilisé' : n === 1 ? '1 photo' : `${n} photos`;
      return `
        <div class="tag-row">
          <div class="tag-row-info">
            <span class="tag-row-name">${esc(tag)}</span>
            <span class="tag-row-usage">${usageLabel}</span>
          </div>
          <button class="btn-icon danger" title="Supprimer ce tag" data-tag="${esc(tag)}">&#128465;</button>
        </div>`;
    }).join('');
  }

  tagsListEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-tag]');
    if (!btn) return;
    confirmDeleteTag(btn.dataset.tag);
  });

  function confirmDeleteTag(tag) {
    modalMode = 'delete-tag';
    pendingTagDelete = tag;
    const n = countTagUsage(tag);
    document.getElementById('modalTitle').textContent = 'Supprimer le tag';
    document.getElementById('modalSubtitle').textContent = n > 0
      ? `« ${tag} » est utilisé par ${n} photo${n > 1 ? 's' : ''}. Il sera retiré de ces photos. Continuer ?`
      : `Supprimer le tag « ${tag} » ?`;
    document.getElementById('modalTagList').innerHTML = '';
    document.getElementById('modalNewTagRow').style.display = 'none';
    const saveBtn = document.getElementById('modalSave');
    saveBtn.textContent = 'Supprimer';
    saveBtn.classList.add('btn-delete-confirm');
    modalOverlay.classList.add('visible');
  }

  tagAddBtn.addEventListener('click', () => {
    const t = tagAddInput.value.trim();
    if (!t) return;
    if (allTags.includes(t)) { toast('Ce tag existe déjà'); return; }
    tagsExtra.push(t);
    tagAddInput.value = '';
    rebuildAllTags();
    renderTagsList();
    renderFilterDropdown();
    toast(`Tag « ${t} » ajouté`);
  });
  tagAddInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); tagAddBtn.click(); }
  });

  // ========================================================
  // TAB 2 : UPLOAD + CROP
  // ========================================================
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', e => { handleFiles(e.target.files); fileInput.value = ''; });

  function handleFiles(files) {
    [...files].forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const id = randomHex(8);
      const filename = 'photo_' + randomHex(8) + '.jpeg';
      const entry = {
        id, filename, file,
        tags: [],
        rotation: 0,
        aspect: 'free',      // 'free' | '1:1' (1:1 utile uniquement pour la vignette grille)
        crop: null,          // {x,y,w,h} en coords de l'image pivotée
        imgEl: null,         // HTMLImageElement (image source)
        rotatedW: 0,
        rotatedH: 0
      };
      uploadQueue.push(entry);
      renderUploadCard(entry);
    });
  }

  function renderUploadCard(entry) {
    const card = document.createElement('div');
    card.className = 'upload-card';
    card.id = 'upload-' + entry.id;

    card.innerHTML = `
      <div class="upload-card-preview" id="preview-${entry.id}">
        <div class="crop-stage" id="stage-${entry.id}">
          <img class="crop-source" id="cropimg-${entry.id}" alt="">
          <div class="crop-box" id="cropbox-${entry.id}">
            <div class="crop-handle" data-h="nw"></div>
            <div class="crop-handle" data-h="ne"></div>
            <div class="crop-handle" data-h="sw"></div>
            <div class="crop-handle" data-h="se"></div>
          </div>
        </div>
        <div class="crop-toolbar">
          <div class="seg-toggle" role="tablist" title="Le format carré est utile uniquement pour la disposition en grille de vignettes. Pour la vue masonry, garder 'Libre' conserve le cadrage d'origine.">
            <button type="button" class="seg-btn active" data-aspect="free">Libre (recommandé)</button>
            <button type="button" class="seg-btn" data-aspect="1:1">Carré (vignette grille)</button>
          </div>
          <div class="rot-group">
            <button type="button" title="Pivoter à gauche" data-rot="-90">&#x21B6;</button>
            <button type="button" title="Pivoter à droite" data-rot="90">&#x21B7;</button>
            <button type="button" title="Réinitialiser le cadre" data-reset="1">&#x21BB; cadre</button>
          </div>
        </div>
      </div>
      <div class="upload-card-body">
        <div class="filename">${esc(entry.filename)}</div>
        <div class="tag-selector" id="tagsel-${entry.id}"></div>
        <div class="new-tag-input">
          <input type="text" placeholder="Nouveau tag..." id="newtag-${entry.id}">
          <button type="button" id="addtag-${entry.id}">+ Ajouter</button>
        </div>
        <button class="btn-add-photo" id="confirm-${entry.id}">Ajouter à la galerie</button>
      </div>`;

    uploadGrid.appendChild(card);

    // Load image then init crop UI
    const imgEl = card.querySelector('#cropimg-' + entry.id);
    imgEl.onload = () => {
      entry.imgEl = imgEl;
      entry.rotatedW = imgEl.naturalWidth;
      entry.rotatedH = imgEl.naturalHeight;
      initCropBox(entry);
    };
    imgEl.src = URL.createObjectURL(entry.file);

    // Tag selector
    renderUploadTags(entry);

    // Add tag
    card.querySelector('#addtag-' + entry.id).addEventListener('click', () => {
      const inp = card.querySelector('#newtag-' + entry.id);
      const t = inp.value.trim();
      if (!t) return;
      inp.value = '';
      if (!allTags.includes(t)) { tagsExtra.push(t); rebuildAllTags(); renderFilterDropdown(); renderTagsList(); }
      if (!entry.tags.includes(t)) entry.tags.push(t);
      uploadQueue.forEach(e => renderUploadTags(e));
    });
    card.querySelector('#newtag-' + entry.id).addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); card.querySelector('#addtag-' + entry.id).click(); }
    });

    // Aspect toggle
    card.querySelectorAll('.seg-btn').forEach(b => {
      b.addEventListener('click', () => {
        card.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        entry.aspect = b.dataset.aspect;
        resetCropBox(entry);
      });
    });

    // Rotate / reset
    card.querySelectorAll('.rot-group [data-rot]').forEach(btn => {
      btn.addEventListener('click', () => applyRotation(entry, parseInt(btn.dataset.rot, 10)));
    });
    card.querySelector('.rot-group [data-reset]').addEventListener('click', () => resetCropBox(entry));

    // Confirm add
    card.querySelector('#confirm-' + entry.id).addEventListener('click', () => addToGallery(entry));
  }

  function renderUploadTags(entry) {
    const container = document.getElementById('tagsel-' + entry.id);
    if (!container) return;
    container.innerHTML = allTags.map(t => {
      const sel = entry.tags.includes(t) ? 'selected' : '';
      return `<span class="tag-toggle ${sel}" data-tag="${esc(t)}">${esc(t)}</span>`;
    }).join('');
    container.querySelectorAll('.tag-toggle').forEach(el => {
      el.addEventListener('click', () => {
        const tag = el.dataset.tag;
        if (entry.tags.includes(tag)) {
          entry.tags = entry.tags.filter(x => x !== tag);
          el.classList.remove('selected');
        } else {
          entry.tags.push(tag);
          el.classList.add('selected');
        }
      });
    });
  }

  // ---- Rotation : réécrit l'image source après rotation pour que le crop bosse
  //      toujours sur une image "droite" (simplifie énormément la géométrie) ----
  async function applyRotation(entry, deltaDeg) {
    const src = entry.imgEl;
    if (!src) return;
    entry.rotation = (entry.rotation + deltaDeg + 360) % 360;
    // On tourne uniquement l'affichage : on réencode via canvas
    const angle = ((deltaDeg % 360) + 360) % 360;
    const rad = angle * Math.PI / 180;
    const w = src.naturalWidth, h = src.naturalHeight;
    const swap = angle === 90 || angle === 270;
    const cw = swap ? h : w;
    const ch = swap ? w : h;
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d');
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate(rad);
    ctx.drawImage(src, -w / 2, -h / 2);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.92));
    if (src.src.startsWith('blob:')) URL.revokeObjectURL(src.src);
    src.onload = () => {
      entry.rotatedW = src.naturalWidth;
      entry.rotatedH = src.naturalHeight;
      resetCropBox(entry);
    };
    src.src = URL.createObjectURL(blob);
  }

  // ---- Crop box : init + interactions ----
  function initCropBox(entry) {
    resetCropBox(entry);
    wireCropInteractions(entry);
  }

  function resetCropBox(entry) {
    const stage = document.getElementById('stage-' + entry.id);
    const box = document.getElementById('cropbox-' + entry.id);
    if (!stage || !box || !entry.imgEl) return;
    // Attendre que l'image soit rendue dans le stage
    requestAnimationFrame(() => {
      const rect = entry.imgEl.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const offsetX = rect.left - stageRect.left;
      const offsetY = rect.top  - stageRect.top;
      let w, h;
      if (entry.aspect === '1:1') {
        const side = Math.min(rect.width, rect.height) * 0.9;
        w = h = side;
      } else {
        w = rect.width * 0.85;
        h = rect.height * 0.85;
      }
      const x = offsetX + (rect.width  - w) / 2;
      const y = offsetY + (rect.height - h) / 2;
      setBox(entry, x, y, w, h);
    });
  }

  function setBox(entry, x, y, w, h) {
    const box = document.getElementById('cropbox-' + entry.id);
    box.style.left   = x + 'px';
    box.style.top    = y + 'px';
    box.style.width  = w + 'px';
    box.style.height = h + 'px';
    entry._boxPx = { x, y, w, h };
  }

  function getImageRect(entry) {
    const stage = document.getElementById('stage-' + entry.id);
    const sRect = stage.getBoundingClientRect();
    const iRect = entry.imgEl.getBoundingClientRect();
    return {
      left:   iRect.left - sRect.left,
      top:    iRect.top  - sRect.top,
      width:  iRect.width,
      height: iRect.height
    };
  }

  function clampBoxToImage(entry, x, y, w, h) {
    const img = getImageRect(entry);
    const minSize = 40;
    w = Math.max(minSize, Math.min(w, img.width));
    h = Math.max(minSize, Math.min(h, img.height));
    x = Math.max(img.left, Math.min(x, img.left + img.width  - w));
    y = Math.max(img.top,  Math.min(y, img.top  + img.height - h));
    return { x, y, w, h };
  }

  function wireCropInteractions(entry) {
    const box = document.getElementById('cropbox-' + entry.id);
    const stage = document.getElementById('stage-' + entry.id);
    if (!box || !stage) return;

    let drag = null; // { type: 'move'|'handle', handle, startX, startY, start: {x,y,w,h} }

    const onDown = (e, handle) => {
      e.preventDefault();
      const p = pointerPos(e, stage);
      drag = {
        type: handle ? 'handle' : 'move',
        handle,
        startX: p.x,
        startY: p.y,
        start: { ...entry._boxPx }
      };
      stage.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!drag) return;
      e.preventDefault();
      const p = pointerPos(e, stage);
      const dx = p.x - drag.startX;
      const dy = p.y - drag.startY;
      const s = drag.start;
      let nx = s.x, ny = s.y, nw = s.w, nh = s.h;
      const aspect = entry.aspect === '1:1' ? 1 : null;

      if (drag.type === 'move') {
        nx = s.x + dx; ny = s.y + dy;
      } else {
        // Handle resize
        const h = drag.handle;
        let ex = s.x + s.w, ey = s.y + s.h;
        let sx = s.x, sy = s.y;
        if (h.includes('e')) ex = s.x + s.w + dx;
        if (h.includes('w')) sx = s.x + dx;
        if (h.includes('s')) ey = s.y + s.h + dy;
        if (h.includes('n')) sy = s.y + dy;

        nw = Math.abs(ex - sx);
        nh = Math.abs(ey - sy);

        if (aspect) {
          // Forcer ratio 1:1 : adapter h à w selon la plus grande variation
          const preferW = Math.abs(dx) >= Math.abs(dy);
          if (preferW) nh = nw / aspect; else nw = nh * aspect;
          // Recalculer sx/sy selon le handle pour que le coin opposé reste fixe
          const anchorX = h.includes('w') ? s.x + s.w : s.x;
          const anchorY = h.includes('n') ? s.y + s.h : s.y;
          sx = h.includes('w') ? anchorX - nw : anchorX;
          sy = h.includes('n') ? anchorY - nh : anchorY;
        }
        nx = Math.min(sx, ex);
        ny = Math.min(sy, ey);
      }

      const c = clampBoxToImage(entry, nx, ny, nw, nh);
      // Si le clamp a réduit une dimension et qu'on a un aspect forcé, corriger l'autre
      if (aspect && Math.abs(c.w / c.h - aspect) > 0.01) {
        if (c.w / aspect <= c.h) c.h = c.w / aspect;
        else c.w = c.h * aspect;
        const r = clampBoxToImage(entry, c.x, c.y, c.w, c.h);
        setBox(entry, r.x, r.y, r.w, r.h);
      } else {
        setBox(entry, c.x, c.y, c.w, c.h);
      }
    };

    const onUp = (e) => {
      drag = null;
      stage.releasePointerCapture?.(e.pointerId);
    };

    box.addEventListener('pointerdown', e => {
      if (e.target.classList.contains('crop-handle')) {
        onDown(e, e.target.dataset.h);
      } else {
        onDown(e, null);
      }
    });
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('pointerleave', onUp);

    // Recalcul de la crop box au resize (rotation, orientation mobile…)
    const ro = new ResizeObserver(() => {
      if (entry._boxPx) {
        // Re-clamp après resize du stage
        const c = clampBoxToImage(entry, entry._boxPx.x, entry._boxPx.y, entry._boxPx.w, entry._boxPx.h);
        setBox(entry, c.x, c.y, c.w, c.h);
      }
    });
    ro.observe(stage);
  }

  function pointerPos(e, stage) {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // ---- Produire le blob final : crop + resize max 1200 + jpeg 0.85 ----
  function processImage(entry) {
    return new Promise((resolve, reject) => {
      if (!entry.imgEl || !entry._boxPx) return reject(new Error('Image non prête'));
      const img = entry.imgEl;
      const imgRect = getImageRect(entry);
      // Passer du CSS px au pixel naturel
      const scaleX = img.naturalWidth  / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      const b = entry._boxPx;
      const sx = (b.x - imgRect.left) * scaleX;
      const sy = (b.y - imgRect.top)  * scaleY;
      const sw = b.w * scaleX;
      const sh = b.h * scaleY;

      // Taille de sortie : max 1200 sur le côté long
      let outW = sw, outH = sh;
      const longer = Math.max(outW, outH);
      if (longer > MAX_OUTPUT) {
        const k = MAX_OUTPUT / longer;
        outW = Math.round(outW * k);
        outH = Math.round(outH * k);
      } else {
        outW = Math.round(outW); outH = Math.round(outH);
      }

      const c = document.createElement('canvas');
      c.width = outW; c.height = outH;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
      c.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob null')), 'image/jpeg', JPEG_QUALITY);
    });
  }

  async function addToGallery(entry) {
    const btn = document.getElementById('confirm-' + entry.id);
    btn.disabled = true;
    btn.textContent = 'Traitement...';

    try {
      const blob = await processImage(entry);
      // 1. Upload du fichier sur le serveur
      await api.postPhoto(entry.filename, blob);
      newPhotos.set(entry.filename, blob);
      // 2. Ajout dans galleryData + persist tags.json
      galleryData.push({ photo: entry.filename, tags: [...entry.tags] });
      rebuildAllTags();
      renderFilterDropdown();
      renderGallery();
      renderTagsList();
      persistTags();

      uploadQueue = uploadQueue.filter(e => e.id !== entry.id);
      const card = document.getElementById('upload-' + entry.id);
      if (card) card.remove();
      toast('Photo ajoutée à la galerie');
      if (uploadQueue.length === 0) tabBtns[0].click();
    } catch (err) {
      console.error(err);
      toast('Erreur lors du traitement');
      btn.disabled = false;
      btn.textContent = 'Ajouter à la galerie';
    }
  }

  // L'ancien bouton d'export ZIP a été remplacé par la sauvegarde automatique
  // via l'API backend (voir `api` / `persistTags` plus haut). Chaque action
  // (ajout, édition, suppression de photo ou de tag) est persistée en direct.

  // ========================================================
  // Helpers
  // ========================================================
  function randomHex(n) {
    const arr = new Uint8Array(n);
    crypto.getRandomValues(arr);
    return [...arr].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, n);
  }
  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('visible'), 2500);
  }

  init();
})();
