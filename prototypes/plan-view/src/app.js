const state = {
  data: null,
  activeRoomId: null,
  activeHotspotId: null,
  filter: 'all',
  viewedHotspots: new Set()
};

const els = {
  app: document.getElementById('app'),
  intro: document.getElementById('intro'),
  introMap: document.getElementById('introMap'),
  introTitle: document.getElementById('introTitle'),
  introEnter: document.getElementById('introEnter'),
  appTitle: document.getElementById('appTitle'),
  filterTabs: document.getElementById('filterTabs'),
  planCanvas: document.getElementById('planCanvas'),
  detailTitle: document.getElementById('detailTitle'),
  detailBody: document.getElementById('detailBody'),
  relatedPeople: document.getElementById('relatedPeople'),
  detailSources: document.getElementById('detailSources'),
  photoFrame: document.getElementById('photoFrame'),
  detailPhoto: document.getElementById('detailPhoto'),
  photoCaption: document.getElementById('photoCaption'),
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
  renderPlan();
  renderSources();
  if (!applyRouteFromHash()) showDefaultDetail();
}

function applyMeta() {
  const { meta } = state.data;
  els.introTitle.textContent = meta.intro.title;
  if (meta.intro.mapUrl) {
    els.introMap.src = meta.intro.mapUrl;
  }
  els.introEnter.textContent = meta.intro.enterLabel ?? 'Vstoupit';
  els.appTitle.textContent = meta.title;
}

function bindEvents() {
  els.introEnter.addEventListener('click', enterPlan);
  els.sourcesButton.addEventListener('click', openSources);
  els.closeSourcesButton.addEventListener('click', closeSources);
  els.sourcesOverlay.addEventListener('click', (event) => {
    if (event.target === els.sourcesOverlay) closeSources();
  });
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('popstate', handleRouteChange);

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter' && els.app.classList.contains('is-splash')) enterPlan();
    if (event.code === 'Escape') closeSources();
  });
}

function enterPlan() {
  if (!els.app.classList.contains('is-splash')) return;
  els.app.classList.remove('is-splash');
}

function handleRouteChange() {
  if (applyRouteFromHash()) return;
  closeSources();
  showDefaultDetail();
}

function openSources() {
  els.sourcesOverlay.classList.add('is-open');
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
    button.addEventListener('click', () => selectRoom(room.id, { updateHash: true }));
    els.planCanvas.append(button);
  }

  for (const hotspot of state.data.hotspots) {
    const photo = getHotspotPhoto(hotspot);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot';
    button.dataset.hotspotId = hotspot.id;
    button.dataset.kind = hotspot.kind;
    button.dataset.roomId = hotspot.roomId;
    button.style.setProperty('--x', `${hotspot.x}%`);
    button.style.setProperty('--y', `${hotspot.y}%`);
    button.setAttribute('aria-label', getHotspotTitle(hotspot));
    button.title = getHotspotTitle(hotspot);
    if (photo?.src) {
      const image = document.createElement('img');
      image.className = 'hotspotImage';
      image.src = photo.src;
      image.alt = '';
      image.loading = 'lazy';
      button.append(image);
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'hotspotFallback';
      fallback.textContent = hotspot.label;
      button.append(fallback);
    }
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      selectHotspot(hotspot.id, { updateHash: true });
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

function selectRoom(roomId, options = {}) {
  const room = getRoom(roomId);
  if (!room) return;

  state.activeRoomId = room.id;
  state.activeHotspotId = null;
  showRoomDetail(room);
  markActiveElements();
  if (options.updateHash) updateRouteHash('room', room.id);
}

function selectHotspot(hotspotId, options = {}) {
  const hotspot = state.data.hotspots.find((entry) => entry.id === hotspotId);
  if (!hotspot) return;

  state.activeHotspotId = hotspot.id;
  state.activeRoomId = hotspot.roomId;
  state.viewedHotspots.add(hotspot.id);

  if (hotspot.detailRoomId) {
    const room = getRoom(hotspot.detailRoomId);
    if (!room) return;
    showRoomDetail(room, hotspot.relatedPersonIds ?? []);
  } else if (hotspot.kind === 'artifact') {
    const artifact = state.data.artifacts.find((entry) => entry.id === hotspot.artifactId);
    if (!artifact) return;
    showDetail({
      title: artifact.name,
      body: artifact.body,
      facts: artifact.facts,
      sourceIds: artifact.sourceIds,
      photo: resolvePhoto(artifact),
      relatedPersonIds: hotspot.relatedPersonIds ?? []
    });
  } else {
    showDetail({
      title: hotspot.title,
      body: hotspot.body,
      facts: hotspot.facts,
      sourceIds: hotspot.sourceIds,
      photo: resolvePhoto(hotspot),
      relatedPersonIds: hotspot.relatedPersonIds ?? []
    });
  }

  markActiveElements();
  if (options.updateHash) updateRouteHash('hotspot', hotspot.id);
}

function selectPerson(personId, options = {}) {
  const person = getPerson(personId);
  if (!person) return;

  state.activeRoomId = null;
  state.activeHotspotId = null;
  showDetail({
    title: person.name,
    body: person.body,
    facts: [],
    sourceIds: person.sourceIds,
    photo: resolvePhoto(person),
    relatedPersonIds: []
  });
  markActiveElements();
  if (options.updateHash) updateRouteHash('person', person.id);
}

function showRoomDetail(room, relatedPersonIds = []) {
  showDetail({
    title: room.title,
    body: room.body,
    facts: room.facts,
    sourceIds: room.sourceIds,
    photo: resolvePhoto(room),
    relatedPersonIds
  });
}

function showDefaultDetail() {
  const detail = state.data.meta.defaultDetail;
  state.activeRoomId = null;
  state.activeHotspotId = null;
  showDetail({
    title: detail.title,
    body: detail.body,
    facts: detail.facts,
    photo: resolvePhoto(detail),
    sourceIds: []
  });
  markActiveElements();
}

function showDetail(detail) {
  els.detailTitle.textContent = detail.title;
  els.detailBody.textContent = buildDetailText(detail.body, detail.facts ?? []);
  renderRelatedPeople(detail.relatedPersonIds ?? []);
  renderDetailSources(detail.sourceIds ?? [], detail.photo);
  renderPhoto(detail.photo);
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
    chip.addEventListener('click', () => selectPerson(person.id, { updateHash: true }));
    els.relatedPeople.append(chip);
  }
}

function buildDetailText(body, facts) {
  const parts = [body, ...facts]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean);
  return parts.join(' ');
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
    return;
  }

  if (sourceIds.length > 0) {
    els.detailSources.append(buildSourcesIndexLink('Zdroje:'));
  }

  if (photo) {
    if (sourceIds.length > 0) els.detailSources.append(document.createTextNode(' · '));
    els.detailSources.append(document.createTextNode('Fotka: '), buildLink(photo.sourceUrl, photo.sourceLabel ?? 'Commons'));
  }
}

function renderSources() {
  els.sourceGrid.replaceChildren();

  const presentation = state.data.sourcePresentation;
  if (!presentation) return;

  els.sourceGrid.className = 'sourcePresentation';

  for (const group of presentation.groups ?? []) {
    const section = document.createElement('section');
    section.className = 'sourceSection';
    const title = document.createElement('h3');
    title.textContent = group.title;
    section.append(title, buildSourceLinkLine(group));
    els.sourceGrid.append(section);
  }
}

function buildSourceLinkLine(group) {
  const line = document.createElement('div');
  line.className = 'sourceLinks';
  const links = [
    ...(group.sourceIds ?? [])
      .map((sourceId) => getSource(sourceId))
      .filter(Boolean)
      .map((source) => ({ label: source.title, url: source.url })),
    ...(group.links ?? [])
  ];

  links.forEach((linkItem, index) => {
    if (index > 0) line.append(document.createTextNode(' · '));
    line.append(buildLink(linkItem.url, linkItem.label));
  });

  return line;
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
  if (hotspot.detailRoomId) return getRoom(hotspot.detailRoomId)?.title ?? hotspot.title;
  if (hotspot.kind !== 'artifact') return hotspot.title;
  const artifact = getArtifact(hotspot.artifactId);
  return artifact?.name ?? hotspot.label;
}

function getHotspotPhoto(hotspot) {
  if (hotspot.detailRoomId) return resolvePhoto(getRoom(hotspot.detailRoomId)) ?? resolvePhoto(hotspot);
  if (hotspot.kind !== 'artifact') return resolvePhoto(hotspot);
  return resolvePhoto(getArtifact(hotspot.artifactId));
}

function getArtifact(artifactId) {
  return state.data.artifacts.find((entry) => entry.id === artifactId);
}

function getPerson(personId) {
  return state.data.people.find((entry) => entry.id === personId);
}

function getRoom(roomId) {
  return state.data.rooms.find((entry) => entry.id === roomId);
}

function getSource(sourceId) {
  return state.data.sources.find((entry) => entry.id === sourceId);
}

function resolvePhoto(item) {
  if (!item) return null;
  if (item.photo) return item.photo;
  if (!item.photoId) return null;
  return state.data.photos?.find((photo) => photo.id === item.photoId) ?? null;
}

function applyRouteFromHash() {
  const route = parseRouteHash();
  if (!route) return false;

  if (route.type === 'room') {
    if (!getRoom(route.id)) return false;
    enterPlan();
    closeSources();
    selectRoom(route.id);
    return true;
  }

  if (route.type === 'hotspot') {
    if (!state.data.hotspots.some((hotspot) => hotspot.id === route.id)) return false;
    enterPlan();
    closeSources();
    selectHotspot(route.id);
    return true;
  }

  if (route.type === 'person') {
    if (!getPerson(route.id)) return false;
    enterPlan();
    closeSources();
    selectPerson(route.id);
    return true;
  }

  return false;
}

function parseRouteHash(hash = window.location.hash) {
  const value = hash.startsWith('#') ? hash.slice(1) : hash;
  const separatorIndex = value.indexOf(':');
  if (separatorIndex < 1) return null;

  const type = value.slice(0, separatorIndex);
  if (!['room', 'hotspot', 'person'].includes(type)) return null;

  try {
    const id = decodeURIComponent(value.slice(separatorIndex + 1));
    return id ? { type, id } : null;
  } catch {
    return null;
  }
}

function updateRouteHash(type, id) {
  const nextHash = `#${type}:${encodeURIComponent(id)}`;
  if (window.location.hash === nextHash) return;
  history.pushState(null, '', nextHash);
}

function buildSourcesIndexLink(label) {
  const link = document.createElement('a');
  link.href = '#sourcesOverlay';
  link.className = 'sourceIndexLink';
  link.textContent = label;
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openSources();
  });
  return link;
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
  els.detailTitle.textContent = 'Nepodařilo se načíst content.json';
  els.detailBody.textContent = `Spusť tuto variantu přes lokální web server, ne přímo jako file://. ${String(error)}`;
}
