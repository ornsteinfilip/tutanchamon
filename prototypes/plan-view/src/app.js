const state = {
  data: null,
  activeRoomId: null,
  activeHotspotId: null,
  filter: 'all',
  viewedHotspots: new Set(),
  viewedArtifacts: new Set()
};

const els = {
  app: document.getElementById('app'),
  intro: document.getElementById('intro'),
  introSky: document.getElementById('introSky'),
  introTitle: document.getElementById('introTitle'),
  modeEyebrow: document.getElementById('modeEyebrow'),
  appTitle: document.getElementById('appTitle'),
  filterTabs: document.getElementById('filterTabs'),
  roomList: document.getElementById('roomList'),
  progressBox: document.getElementById('progressBox'),
  planCanvas: document.getElementById('planCanvas'),
  detailKicker: document.getElementById('detailKicker'),
  detailTitle: document.getElementById('detailTitle'),
  detailMeta: document.getElementById('detailMeta'),
  detailBody: document.getElementById('detailBody'),
  factList: document.getElementById('factList'),
  relatedPeople: document.getElementById('relatedPeople'),
  detailSources: document.getElementById('detailSources'),
  photoFrame: document.getElementById('photoFrame'),
  detailPhoto: document.getElementById('detailPhoto'),
  photoCaption: document.getElementById('photoCaption'),
  statusText: document.getElementById('statusText'),
  artifactStrip: document.getElementById('artifactStrip'),
  sourcesButton: document.getElementById('sourcesButton'),
  closeSourcesButton: document.getElementById('closeSourcesButton'),
  sourcesOverlay: document.getElementById('sourcesOverlay'),
  sourceGrid: document.getElementById('sourceGrid')
};

init();

async function init() {
  try {
    const response = await fetch('./data/content.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
  } catch (error) {
    showLoadError(error);
    return;
  }

  applyMeta();
  bindEvents();
  renderFilters();
  renderRoomList();
  renderPlan();
  renderArtifactStrip();
  renderSources();
  showDefaultDetail();
  updateProgress();
}

function applyMeta() {
  const { meta } = state.data;
  els.introTitle.textContent = meta.intro.title;
  if (meta.intro.photo?.src) {
    els.introSky.style.setProperty('--intro-photo', `url("${meta.intro.photo.src}")`);
  }
  els.modeEyebrow.textContent = meta.variantTitle;
  els.appTitle.textContent = meta.title;
  els.statusText.textContent = meta.statusIntro;
}

function bindEvents() {
  els.intro.addEventListener('click', enterPlan);
  els.sourcesButton.addEventListener('click', () => {
    els.sourcesOverlay.classList.add('is-open');
  });
  els.closeSourcesButton.addEventListener('click', closeSources);
  els.sourcesOverlay.addEventListener('click', (event) => {
    if (event.target === els.sourcesOverlay) closeSources();
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter' && els.app.classList.contains('is-splash')) enterPlan();
    if (event.code === 'Escape') closeSources();
  });
}

function enterPlan() {
  if (!els.app.classList.contains('is-splash')) return;
  els.app.classList.remove('is-splash');
  els.statusText.textContent = state.data.meta.statusReady;
}

function closeSources() {
  els.sourcesOverlay.classList.remove('is-open');
}

function renderFilters() {
  els.filterTabs.replaceChildren();

  for (const filter of state.data.filters) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabButton';
    button.textContent = filter.label;
    button.dataset.filter = filter.id;
    button.setAttribute('aria-pressed', String(filter.id === state.filter));
    button.addEventListener('click', () => {
      state.filter = filter.id;
      renderFilters();
      updateHotspotVisibility();
    });
    els.filterTabs.append(button);
  }

  markActiveFilters();
}

function markActiveFilters() {
  for (const button of els.filterTabs.querySelectorAll('.tabButton')) {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

function renderRoomList() {
  els.roomList.replaceChildren();

  for (const room of state.data.rooms) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'roomButton';
    button.dataset.roomId = room.id;
    button.addEventListener('click', () => selectRoom(room.id));

    const index = document.createElement('span');
    index.className = 'roomIndex';
    index.textContent = room.index;

    const textWrap = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'roomName';
    name.textContent = room.title;
    const summary = document.createElement('span');
    summary.className = 'roomSummary';
    summary.textContent = room.summary;
    textWrap.append(name, summary);

    button.append(index, textWrap);
    els.roomList.append(button);
  }
}

function renderPlan() {
  els.planCanvas.replaceChildren();

  for (const connector of state.data.connectors) {
    const element = document.createElement('div');
    element.className = 'corridorLink';
    applyPlanBox(element, connector);
    els.planCanvas.append(element);
  }

  for (const room of state.data.rooms) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'roomShape';
    button.dataset.roomId = room.id;
    button.dataset.label = room.label;
    button.setAttribute('aria-label', room.title);
    applyPlanBox(button, room);
    button.addEventListener('click', () => selectRoom(room.id));
    els.planCanvas.append(button);
  }

  for (const hotspot of state.data.hotspots) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot';
    button.dataset.hotspotId = hotspot.id;
    button.dataset.kind = hotspot.kind;
    button.dataset.roomId = hotspot.roomId;
    button.textContent = hotspot.label;
    button.style.setProperty('--x', `${hotspot.x}%`);
    button.style.setProperty('--y', `${hotspot.y}%`);
    button.setAttribute('aria-label', getHotspotTitle(hotspot));
    button.title = getHotspotTitle(hotspot);
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      selectHotspot(hotspot.id);
    });
    els.planCanvas.append(button);
  }

  const legend = document.createElement('div');
  legend.className = 'planLegend';
  legend.append(
    buildLegendItem('artifact', 'předmět'),
    buildLegendItem('fact', 'fakt'),
    buildLegendItem('person', 'osoba')
  );
  els.planCanvas.append(legend);
}

function buildLegendItem(kind, label) {
  const item = document.createElement('span');
  const dot = document.createElement('span');
  dot.className = 'legendDot';
  dot.style.background = `var(--${kind === 'artifact' ? 'artifact' : kind})`;
  item.append(dot, document.createTextNode(label));
  return item;
}

function applyPlanBox(element, item) {
  element.style.setProperty('--x', `${item.x}%`);
  element.style.setProperty('--y', `${item.y}%`);
  element.style.setProperty('--w', `${item.w}%`);
  element.style.setProperty('--h', `${item.h}%`);
}

function selectRoom(roomId) {
  const room = state.data.rooms.find((entry) => entry.id === roomId);
  if (!room) return;

  state.activeRoomId = room.id;
  state.activeHotspotId = null;
  showDetail({
    kicker: 'Místnost',
    title: room.title,
    meta: room.summary,
    body: room.body,
    facts: room.facts,
    sourceIds: room.sourceIds,
    relatedPersonIds: []
  });
  markActiveElements();
}

function selectHotspot(hotspotId) {
  const hotspot = state.data.hotspots.find((entry) => entry.id === hotspotId);
  if (!hotspot) return;

  state.activeHotspotId = hotspot.id;
  state.activeRoomId = hotspot.roomId;
  state.viewedHotspots.add(hotspot.id);

  if (hotspot.kind === 'artifact') {
    const artifact = state.data.artifacts.find((entry) => entry.id === hotspot.artifactId);
    if (!artifact) return;
    state.viewedArtifacts.add(artifact.id);
    showDetail({
      kicker: 'Předmět',
      title: artifact.name,
      meta: `${getRoomTitle(artifact.roomId)} · ${artifact.short}`,
      body: artifact.body,
      facts: artifact.facts,
      sourceIds: artifact.sourceIds,
      photo: artifact.photo,
      relatedPersonIds: hotspot.relatedPersonIds ?? []
    });
  } else {
    showDetail({
      kicker: hotspot.kind === 'person' ? 'Osoba / souvislost' : 'Fakt',
      title: hotspot.title,
      meta: getRoomTitle(hotspot.roomId),
      body: hotspot.body,
      facts: hotspot.facts,
      sourceIds: hotspot.sourceIds,
      relatedPersonIds: hotspot.relatedPersonIds ?? []
    });
  }

  markActiveElements();
  renderArtifactStrip();
  updateProgress();
}

function showDefaultDetail() {
  const detail = state.data.meta.defaultDetail;
  showDetail({
    kicker: detail.kicker,
    title: detail.title,
    meta: detail.meta,
    body: detail.body,
    facts: detail.facts,
    sourceIds: []
  });
}

function showDetail(detail) {
  els.detailKicker.textContent = detail.kicker;
  els.detailTitle.textContent = detail.title;
  els.detailMeta.textContent = detail.meta;
  els.detailBody.textContent = detail.body;
  renderFacts(detail.facts ?? []);
  renderRelatedPeople(detail.relatedPersonIds ?? []);
  renderDetailSources(detail.sourceIds ?? [], detail.photo);
  renderPhoto(detail.photo);
  els.statusText.textContent = detail.photo
    ? `Detail: ${detail.title}. Fotka je lokálně stažená a zdroj je v popisku.`
    : `Detail: ${detail.title}.`;
}

function renderFacts(facts) {
  els.factList.replaceChildren();
  for (const fact of facts) {
    const item = document.createElement('li');
    item.textContent = fact;
    els.factList.append(item);
  }
}

function renderRelatedPeople(personIds) {
  els.relatedPeople.replaceChildren();
  for (const personId of personIds) {
    const person = state.data.people.find((entry) => entry.id === personId);
    if (!person) continue;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'personChip';
    chip.textContent = person.name;
    chip.title = person.role;
    chip.addEventListener('click', () => {
      showDetail({
        kicker: 'Osoba',
        title: person.name,
        meta: person.role,
        body: person.body,
        facts: [],
        sourceIds: person.sourceIds,
        relatedPersonIds: []
      });
    });
    els.relatedPeople.append(chip);
  }
}

function renderPhoto(photo) {
  if (!photo) {
    els.photoFrame.hidden = true;
    els.detailPhoto.removeAttribute('src');
    els.detailPhoto.alt = '';
    els.photoCaption.textContent = '';
    return;
  }

  els.photoFrame.hidden = false;
  els.detailPhoto.src = photo.src;
  els.detailPhoto.alt = photo.alt;
  els.photoCaption.replaceChildren(
    document.createTextNode(`${photo.caption} ${photo.credit} ${photo.license} `),
    buildLink(photo.sourceUrl, 'Stránka fotky')
  );
}

function renderDetailSources(sourceIds, photo) {
  els.detailSources.replaceChildren();
  if (sourceIds.length === 0 && !photo) {
    els.detailSources.textContent = state.data.meta.sourceNote;
    return;
  }

  if (sourceIds.length > 0) {
    els.detailSources.append(document.createTextNode('Zdroje: '));
    sourceIds.forEach((sourceId, index) => {
      const source = state.data.sources.find((entry) => entry.id === sourceId);
      if (!source) return;
      if (index > 0) els.detailSources.append(document.createTextNode(', '));
      els.detailSources.append(buildLink(source.url, source.id));
    });
  }

  if (photo) {
    if (sourceIds.length > 0) els.detailSources.append(document.createTextNode(' · '));
    els.detailSources.append(document.createTextNode('Fotka: '), buildLink(photo.sourceUrl, 'Commons'));
  }
}

function renderArtifactStrip() {
  els.artifactStrip.replaceChildren();

  for (const artifact of state.data.artifacts) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'artifactSlot';
    slot.classList.toggle('is-viewed', state.viewedArtifacts.has(artifact.id));
    slot.textContent = artifact.icon;
    slot.title = artifact.name;
    slot.setAttribute('aria-label', artifact.name);
    slot.addEventListener('click', () => {
      const hotspot = state.data.hotspots.find((entry) => entry.artifactId === artifact.id);
      if (hotspot) selectHotspot(hotspot.id);
    });
    els.artifactStrip.append(slot);
  }
}

function renderSources() {
  els.sourceGrid.replaceChildren();

  for (const source of state.data.sources) {
    const item = document.createElement('article');
    item.className = 'sourceItem';
    const title = document.createElement('strong');
    title.textContent = `${source.id} · ${source.title}`;
    const body = document.createElement('p');
    body.textContent = `${source.usedFor} Citováno: ${source.accessedAt}`;
    item.append(title, body, buildLink(source.url, 'Otevřít zdroj'));
    els.sourceGrid.append(item);
  }

  for (const artifact of state.data.artifacts) {
    if (!artifact.photo) continue;
    const item = document.createElement('article');
    item.className = 'sourceItem';
    const title = document.createElement('strong');
    title.textContent = `Foto · ${artifact.name}`;
    const body = document.createElement('p');
    body.textContent = `${artifact.photo.caption} ${artifact.photo.credit} ${artifact.photo.license}`;
    item.append(title, body, buildLink(artifact.photo.sourceUrl, 'Stránka souboru'));
    els.sourceGrid.append(item);
  }
}

function updateProgress() {
  const totalArtifacts = state.data.artifacts.length;
  const viewedArtifacts = state.viewedArtifacts.size;
  const totalHotspots = state.data.hotspots.length;
  const viewedHotspots = state.viewedHotspots.size;
  els.progressBox.textContent = `Prohlédnuté předměty: ${viewedArtifacts}/${totalArtifacts}. Prohlédnuté body: ${viewedHotspots}/${totalHotspots}. Obsah je editovatelný v data/content.json.`;
}

function updateHotspotVisibility() {
  for (const button of els.planCanvas.querySelectorAll('.hotspot')) {
    const visible = state.filter === 'all' || button.dataset.kind === state.filter;
    button.classList.toggle('is-hidden', !visible);
  }
}

function markActiveElements() {
  for (const button of document.querySelectorAll('[data-room-id]')) {
    button.classList.toggle('is-active', button.dataset.roomId === state.activeRoomId);
  }

  for (const button of els.planCanvas.querySelectorAll('.hotspot')) {
    button.classList.toggle('is-active', button.dataset.hotspotId === state.activeHotspotId);
    button.classList.toggle('is-viewed', state.viewedHotspots.has(button.dataset.hotspotId));
  }
}

function getHotspotTitle(hotspot) {
  if (hotspot.kind !== 'artifact') return hotspot.title;
  const artifact = state.data.artifacts.find((entry) => entry.id === hotspot.artifactId);
  return artifact?.name ?? hotspot.label;
}

function getRoomTitle(roomId) {
  return state.data.rooms.find((entry) => entry.id === roomId)?.title ?? 'KV62';
}

function buildLink(url, label) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label;
  return link;
}

function showLoadError(error) {
  els.app.classList.remove('is-splash');
  els.detailKicker.textContent = 'Chyba načtení';
  els.detailTitle.textContent = 'Nepodařilo se načíst content.json';
  els.detailMeta.textContent = 'Spusť tuto variantu přes lokální web server, ne přímo jako file://.';
  els.detailBody.textContent = String(error);
  els.statusText.textContent = 'Obsah se nenačetl.';
}
