const STORAGE_KEY = "mandala-art-data";
const ROOT_ID = "root";
// 3x3グリッド上の位置(0-8, 行優先)。中央(4)を除いた8マス分の並び。
const GRID_POSITIONS = [0, 1, 2, 3, 5, 6, 7, 8];

const gridEl = document.getElementById("grid");
const breadcrumbEl = document.getElementById("breadcrumb");
const statusEl = document.getElementById("status-message");
const expandBtn = document.getElementById("expand-btn");
const backBtn = document.getElementById("back-btn");
const mapBtn = document.getElementById("map-btn");
const closeMapBtn = document.getElementById("close-map-btn");
const resetBtn = document.getElementById("reset-btn");
const gridView = document.getElementById("grid-view");
const mapView = document.getElementById("map-view");
const mapTreeEl = document.getElementById("map-tree");

let state = loadState();

function makeId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now();
}

function freshState() {
  return {
    rootId: ROOT_ID,
    currentId: ROOT_ID,
    pages: {
      [ROOT_ID]: {
        id: ROOT_ID,
        parentId: null,
        parentIndex: null,
        theme: "",
        cells: Array(8).fill(""),
        childIds: Array(8).fill(null),
      },
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed.pages || !parsed.pages[parsed.rootId]) return freshState();
    return parsed;
  } catch (e) {
    return freshState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getPage(id) {
  return state.pages[id];
}

function getCenterText(page) {
  if (page.parentId === null) return page.theme || "";
  const parent = getPage(page.parentId);
  if (!parent) return "";
  return parent.cells[page.parentIndex] || "";
}

function navigateTo(id) {
  if (!state.pages[id]) return;
  state.currentId = id;
  saveState();
  showGridView();
  render();
}

function showGridView() {
  gridView.hidden = false;
  mapView.hidden = true;
}

function showMapView() {
  gridView.hidden = true;
  mapView.hidden = false;
  renderMap();
}

function render() {
  const page = getPage(state.currentId);
  renderBreadcrumb(page);
  renderGrid(page);
  renderStatus(page);
  backBtn.disabled = page.parentId === null;
}

function renderBreadcrumb(currentPage) {
  const chain = [];
  let p = currentPage;
  while (p) {
    chain.unshift(p);
    p = p.parentId !== null ? getPage(p.parentId) : null;
  }

  breadcrumbEl.innerHTML = "";
  chain.forEach((p, i) => {
    const li = document.createElement("li");
    const label = getCenterText(p).trim() || "(無題)";
    if (i === chain.length - 1) {
      li.textContent = label;
      li.className = "current";
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => navigateTo(p.id));
      li.appendChild(btn);
    }
    breadcrumbEl.appendChild(li);
  });
}

function renderGrid(page) {
  gridEl.innerHTML = "";
  const cellsByPos = new Array(9);

  // 中央マス
  const centerCell = document.createElement("div");
  centerCell.className = "cell center";
  const centerTextarea = document.createElement("textarea");
  centerTextarea.rows = 2;
  const isRoot = page.parentId === null;
  if (isRoot) {
    centerTextarea.value = page.theme || "";
    centerTextarea.placeholder = "テーマを入力";
    centerTextarea.addEventListener("input", (e) => {
      page.theme = e.target.value;
      saveState();
      renderBreadcrumb(page);
      renderStatus(page);
    });
  } else {
    centerTextarea.value = getCenterText(page);
    centerTextarea.disabled = true;
    centerCell.classList.add("derived");
  }
  centerCell.appendChild(centerTextarea);
  cellsByPos[4] = centerCell;

  // 周囲8マス
  GRID_POSITIONS.forEach((pos, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.value = page.cells[idx] || "";
    textarea.placeholder = "連想する語";
    textarea.addEventListener("input", (e) => {
      page.cells[idx] = e.target.value;
      saveState();
      renderStatus(page);
    });
    cell.appendChild(textarea);

    if (page.childIds[idx]) {
      cell.classList.add("has-child");
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "cell-open-link";
      openBtn.textContent = "開く";
      openBtn.title = "このテーマのページを開く";
      openBtn.addEventListener("click", () => navigateTo(page.childIds[idx]));
      cell.appendChild(openBtn);
    }

    cellsByPos[pos] = cell;
  });

  cellsByPos.forEach((cell) => gridEl.appendChild(cell));
}

function renderStatus(page) {
  const filledCount = page.cells.filter((c) => c.trim() !== "").length;
  const allFilled = filledCount === 8;
  const allExpanded = allFilled && page.childIds.every((id) => id !== null);

  if (!allFilled) {
    statusEl.textContent = `あと${8 - filledCount}マス埋めると、8つの語からそれぞれ新しいページを作成できます。`;
    expandBtn.hidden = true;
  } else if (!allExpanded) {
    statusEl.textContent = "8マスすべて埋まりました。ボタンを押すと8つの語それぞれの新しいページを作成します。";
    expandBtn.hidden = false;
  } else {
    statusEl.textContent = "8つの新しいページが作成済みです。緑の枠のマスから開けます。";
    expandBtn.hidden = true;
  }
}

function expandCurrentPage() {
  const page = getPage(state.currentId);
  page.childIds.forEach((childId, idx) => {
    if (childId) return;
    if (!page.cells[idx] || !page.cells[idx].trim()) return;
    const newId = makeId();
    state.pages[newId] = {
      id: newId,
      parentId: page.id,
      parentIndex: idx,
      theme: null,
      cells: Array(8).fill(""),
      childIds: Array(8).fill(null),
    };
    page.childIds[idx] = newId;
  });
  saveState();
  render();
}

function renderMap() {
  mapTreeEl.innerHTML = "";
  const rootUl = document.createElement("ul");
  rootUl.appendChild(buildMapNode(getPage(state.rootId)));
  mapTreeEl.appendChild(rootUl);
}

function buildMapNode(page) {
  const li = document.createElement("li");
  if (page.id === state.currentId) li.classList.add("current-page");

  const label = getCenterText(page).trim();
  const btn = document.createElement("button");
  btn.type = "button";
  if (label) {
    btn.textContent = label;
  } else {
    btn.textContent = "(無題)";
    btn.classList.add("empty-theme");
  }
  btn.addEventListener("click", () => {
    navigateTo(page.id);
  });
  li.appendChild(btn);

  const children = page.childIds.filter((id) => id !== null);
  if (children.length > 0) {
    const ul = document.createElement("ul");
    children.forEach((childId) => {
      ul.appendChild(buildMapNode(getPage(childId)));
    });
    li.appendChild(ul);
  }

  return li;
}

backBtn.addEventListener("click", () => {
  const page = getPage(state.currentId);
  if (page.parentId !== null) navigateTo(page.parentId);
});

expandBtn.addEventListener("click", expandCurrentPage);

mapBtn.addEventListener("click", showMapView);
closeMapBtn.addEventListener("click", showGridView);

resetBtn.addEventListener("click", () => {
  const ok = confirm("現在のノートをすべて削除して、新しいノートを作成します。よろしいですか？");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state = freshState();
  saveState();
  showGridView();
  render();
});

render();
