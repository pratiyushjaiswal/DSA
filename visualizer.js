/**
 * Data Structure Visualizer - Rendering & Auto-Follow Engine (Version 2.0)
 * Renders Array, Singly Linked List, Stack, Queue, Binary Search Tree,
 * Searching/Sorting, and Incremental Pattern Printing.
 * Features: Automatic Viewport Auto-Follow, High-Contrast Highlighting, and Responsive Geometry.
 * Developer Credit: Developed by Pratyush Jaiswal
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CVisualizer = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Permitted index variable names for array pointer tags
  const VALID_INDEX_POINTERS = new Set([
    'i', 'j', 'k', 'pos', 'index', 'idx', 'p', 'curr', 'cursor',
    'low', 'high', 'mid', 'min_idx', 'max_idx', 'left', 'right', 'front', 'rear'
  ]);

  // --- Main Render Dispatcher ---
  function render(viewportEl, step) {
    if (!viewportEl) return;
    if (!step || !step.memory_state) {
      renderEmpty(viewportEl);
      return;
    }

    const mem = step.memory_state;
    const dsType = step.ds_type || mem.type;

    switch (dsType) {
      case 'pattern':
        renderPattern(viewportEl, mem, step);
        break;
      case 'multiplication_table':
        renderMultiplicationTable(viewportEl, mem, step);
        break;
      case 'stack':
        renderStack(viewportEl, mem);
        break;
      case 'queue':
        renderQueue(viewportEl, mem);
        break;
      case 'bst':
        renderBST(viewportEl, mem, step);
        break;
      case 'searching_sorting':
        renderSearchSort(viewportEl, mem);
        break;
      case 'linked_list':
        renderLinkedList(viewportEl, mem);
        break;
      case 'array':
      default:
        renderArray(viewportEl, mem, step);
        break;
    }
  }

  function renderEmpty(viewportEl) {
    viewportEl.innerHTML = `
      <div class="empty-state-placeholder">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#3C3C3C" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="10" rx="2"></rect>
          <line x1="7" y1="7" x2="7" y2="17"></line>
          <line x1="12" y1="7" x2="12" y2="17"></line>
          <line x1="17" y1="7" x2="17" y2="17"></line>
        </svg>
        <p>Ready to trace memory. Click <strong>Run Code</strong> (or press <strong>Ctrl+Enter</strong>).</p>
      </div>`;
  }

  // --- 1. Array Visualization ---
  function renderArray(viewportEl, mem, step) {
    if (mem.type === 'multiplication_table' || mem.name === 'table' ||
        (mem.capacity === 0 && (step?.variables?.num !== undefined && (step?.variables?.prod !== undefined || step?.variables?.i !== undefined)))) {
      renderMultiplicationTable(viewportEl, mem, step);
      return;
    }

    const capacity = mem.capacity || (mem.elements ? mem.elements.length : 0);
    const length = mem.length !== undefined ? mem.length : (mem.elements ? mem.elements.length : 0);
    const elements = mem.elements || [];
    const accessed = new Set(mem.highlight_indices?.accessed || []);
    const modified = new Set(mem.highlight_indices?.modified || []);
    const pointers = mem.highlight_indices?.pointers || {};

    let html = `
      <div class="viz-wrapper array-viz-wrapper">
        <div class="viz-meta-header">
          <span>Array: <strong>${escapeHtml(mem.name || 'arr')}</strong></span>
          <span>Logical Length: <strong>${length}</strong></span>
          <span>Capacity: <strong>${capacity}</strong></span>
        </div>
        <div class="array-cells-track">`;

    for (let i = 0; i < capacity; i++) {
      const val = (i < elements.length) ? elements[i] : 0;
      const isUnused = (i >= length);

      // Only display pointer tags for valid index variables (NOT accumulators like sum, total)
      const activePtrs = [];
      for (const [pName, pVal] of Object.entries(pointers)) {
        if (VALID_INDEX_POINTERS.has(pName) && pVal === i) {
          activePtrs.push(pName);
        }
      }

      let highlightClass = '';
      if (modified.has(i)) highlightClass = 'modified';
      else if (accessed.has(i)) highlightClass = 'accessed';
      if (isUnused) highlightClass += ' unused';

      html += `
        <div class="array-cell-unit">
          ${activePtrs.length > 0 ? `<div class="cell-pointer-tag">${escapeHtml(activePtrs.join(', '))}</div>` : ''}
          <div class="array-cell-box ${highlightClass}" id="cell_${i}" data-index="${i}" title="${escapeHtml(mem.name || 'arr')}[${i}] = ${val}">
            <span class="cell-val">${val}</span>
            <span class="cell-offset">+0x${(i * 4).toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <span class="cell-index-label">[${i}]</span>
        </div>`;
    }

    html += `
        </div>
      </div>`;

    viewportEl.innerHTML = html;
  }

  // --- 2. Singly Linked List Visualization ---
  function renderLinkedList(viewportEl, mem) {
    const headId = mem.head;
    const nodes = mem.nodes || [];
    const pointers = mem.pointers || {};
    const accessed = new Set(mem.highlight_nodes?.accessed || []);
    const modified = new Set(mem.highlight_nodes?.modified || []);
    const created = new Set(mem.highlight_nodes?.created || []);
    const deleted = new Set(mem.highlight_nodes?.deleted || []);

    if (nodes.length === 0 && !headId) {
      viewportEl.innerHTML = `
        <div class="viz-wrapper ll-viz-wrapper">
          <div class="head-pointer-marker">
            <span class="head-badge">HEAD</span>
            <svg class="head-arrow-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#007ACC" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <div class="null-terminal-card" style="margin-left: 10px;">
            <span>NULL (Empty List)</span>
          </div>
        </div>`;
      return;
    }

    let html = `
      <div class="viz-wrapper ll-viz-wrapper">
        <div class="head-pointer-marker">
          <span class="head-badge">HEAD</span>
          <svg class="head-arrow-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#007ACC" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>`;

    nodes.forEach((node, idx) => {
      const nid = node.id;
      const addr = node.addr || `0x${(0x1010 + idx * 16).toString(16).toUpperCase()}`;
      const data = node.data !== undefined ? node.data : node.val;
      const nextId = node.next;

      const attachedPtrs = [];
      for (const [pName, pTarget] of Object.entries(pointers)) {
        if (pTarget === nid && pName !== 'head') {
          attachedPtrs.push(pName);
        }
      }

      let highlightClass = '';
      if (deleted.has(nid)) highlightClass = 'deleted';
      else if (modified.has(nid)) highlightClass = 'modified';
      else if (accessed.has(nid)) highlightClass = 'accessed';
      else if (created.has(nid)) highlightClass = 'created';

      html += `
        <div class="ll-node-unit" id="node_wrap_${nid}">
          ${attachedPtrs.length > 0 ? `
            <div class="node-pointer-tags">
              ${attachedPtrs.map(p => `<span class="node-ptr-badge">${escapeHtml(p)}</span>`).join('')}
            </div>` : ''}

          <div class="ll-node-card ${highlightClass}" id="ll_node_${nid}">
            <div class="node-addr-header">${addr}</div>
            <div class="node-compartments">
              <div class="node-compartment-data" title="data">
                <span class="compartment-label">DATA</span>
                <span class="node-data-val">${data}</span>
              </div>
              <div class="node-compartment-next" title="next: ${nextId ? nextId : 'NULL'}">
                <span class="compartment-label">NEXT</span>
                <span class="node-next-bullet">${nextId ? '•' : 'Ø'}</span>
              </div>
            </div>
          </div>

          <div class="ll-arrow-connector">
            <div class="arrow-line"></div>
            <div class="arrow-head"></div>
          </div>
        </div>`;
    });

    html += `
        <div class="null-terminal-card">
          <span>NULL</span>
        </div>
      </div>`;

    viewportEl.innerHTML = html;
  }

  // --- 3. Stack Visualization ---
  function renderStack(viewportEl, mem) {
    const capacity = mem.capacity || 5;
    const top = mem.top !== undefined ? mem.top : -1;
    const elements = mem.elements || [];
    const modified = new Set(mem.highlight_indices?.modified || []);
    const accessed = new Set(mem.highlight_indices?.accessed || []);

    let html = `
      <div class="viz-wrapper stack-viz-wrapper">
        <div class="viz-meta-header">
          <span>Structure: <strong>Stack (LIFO)</strong></span>
          <span>Top: <strong>${top}</strong></span>
          <span>Capacity: <strong>${capacity}</strong></span>
          ${top >= capacity ? '<span class="status-warning-badge">OVERFLOW!</span>' : ''}
          ${top < -1 ? '<span class="status-warning-badge">UNDERFLOW!</span>' : ''}
        </div>

        <div class="stack-beaker-container">
          <div class="stack-capacity-ruler">
            ${Array.from({ length: capacity }, (_, i) => capacity - 1 - i).map(idx => `
              <div class="ruler-notch">
                <span class="ruler-num">[${idx}]</span>
                ${idx === top ? '<span class="top-indicator-badge">← TOP</span>' : ''}
              </div>
            `).join('')}
          </div>

          <div class="stack-beaker">`;

    for (let i = capacity - 1; i >= 0; i--) {
      const isFilled = i <= top && i >= 0;
      const val = isFilled && i < elements.length ? elements[i] : '';

      let highlightClass = '';
      if (modified.has(i)) highlightClass = 'modified';
      else if (accessed.has(i)) highlightClass = 'accessed';
      if (!isFilled) highlightClass += ' empty-slot';

      html += `
        <div class="stack-block ${highlightClass}" id="stack_cell_${i}">
          <span class="stack-val">${val !== '' ? val : '—'}</span>
          <span class="stack-idx-tag">idx: ${i}</span>
        </div>`;
    }

    html += `
            <div class="stack-base-platform">STACK BASE</div>
          </div>
        </div>
      </div>`;

    viewportEl.innerHTML = html;
  }

  // --- 4. Queue Visualization ---
  function renderQueue(viewportEl, mem) {
    const capacity = mem.capacity || 5;
    const front = mem.front !== undefined ? mem.front : 0;
    const rear = mem.rear !== undefined ? mem.rear : 0;
    const elements = mem.elements || [];
    const modified = new Set(mem.highlight_indices?.modified || []);
    const accessed = new Set(mem.highlight_indices?.accessed || []);

    let html = `
      <div class="viz-wrapper queue-viz-wrapper">
        <div class="viz-meta-header">
          <span>Structure: <strong>Queue (FIFO)</strong></span>
          <span>Front: <strong>${front}</strong></span>
          <span>Rear: <strong>${rear}</strong></span>
          <span>Capacity: <strong>${capacity}</strong></span>
        </div>

        <div class="queue-lane-container">
          <div class="queue-flow-header">
            <span class="flow-tag dequeue-tag">◀ DEQUEUE (Exit)</span>
            <span class="flow-tag enqueue-tag">ENQUEUE (Enter) ◀</span>
          </div>

          <div class="queue-cells-track">`;

    for (let i = 0; i < capacity; i++) {
      const isQueued = i >= front && i < rear;
      const val = i < elements.length ? elements[i] : 0;

      let highlightClass = '';
      if (modified.has(i)) highlightClass = 'modified';
      else if (accessed.has(i)) highlightClass = 'accessed';
      if (!isQueued) highlightClass += ' unused';

      html += `
        <div class="queue-cell-unit">
          <div class="queue-pointer-flags">
            ${i === front ? '<span class="queue-flag front-flag">FRONT</span>' : ''}
            ${i === rear ? '<span class="queue-flag rear-flag">REAR</span>' : ''}
          </div>
          <div class="queue-cell-box ${highlightClass}" id="queue_cell_${i}">
            <span class="cell-val">${isQueued ? val : '—'}</span>
          </div>
          <span class="cell-index-label">[${i}]</span>
        </div>`;
    }

    html += `
          </div>
        </div>
      </div>`;

    viewportEl.innerHTML = html;
  }

  // --- 5. Binary Search Tree Visualization ---
  function renderBST(viewportEl, mem, step) {
    const rootId = mem.root;
    const nodes = mem.nodes || [];
    const pointers = mem.pointers || (step?.variables ? { ...step.variables } : {});
    const accessed = new Set(mem.highlight_nodes?.accessed || []);
    const modified = new Set(mem.highlight_nodes?.modified || []);
    const created = new Set(mem.highlight_nodes?.created || []);
    const compared = new Set(mem.highlight_nodes?.compared || []);

    if (!rootId || nodes.length === 0) {
      viewportEl.innerHTML = `
        <div class="viz-wrapper bst-viz-wrapper">
          <div class="viz-meta-header">
            <span>Structure: <strong>Binary Search Tree (BST)</strong></span>
            <span>Root: <strong>NULL (Empty Tree)</strong></span>
          </div>
          <div class="null-terminal-card" style="margin-top: 24px;">
            <span>NULL (Empty Tree)</span>
          </div>
        </div>`;
      return;
    }

    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    const coords = {};
    const depthMap = {};

    function assignPositions(nid, depth, leftBound, rightBound) {
      if (!nid || !nodeMap[nid]) return;
      depthMap[nid] = depth;
      const x = Math.round((leftBound + rightBound) / 2);
      const y = 45 + depth * 75;
      coords[nid] = { x, y, depth, isTree: true };

      const node = nodeMap[nid];
      if (node.left) {
        assignPositions(node.left, depth + 1, leftBound, x);
      }
      if (node.right) {
        assignPositions(node.right, depth + 1, x, rightBound);
      }
    }

    assignPositions(rootId, 0, 40, 560);

    // Identify unattached / newly allocated nodes that are not yet linked to the tree root
    const unattachedNodes = nodes.filter(n => !coords[n.id]);
    unattachedNodes.forEach((node, idx) => {
      let ptrName = '';
      for (const [pName, pTarget] of Object.entries(pointers)) {
        if (pTarget === node.id && pName !== 'root') {
          ptrName = pName;
          break;
        }
      }

      let x = 160 + idx * 160;
      if (ptrName.toLowerCase().includes('left')) x = 160;
      else if (ptrName.toLowerCase().includes('right')) x = 440;
      else if (unattachedNodes.length === 1) x = 300;

      coords[node.id] = {
        x,
        y: 240,
        depth: -1,
        isTree: false,
        isUnattached: true,
        ptrName
      };
    });

    let svgLines = '';
    let nodesHtml = '';

    nodes.forEach(node => {
      const nid = node.id;
      const c = coords[nid] || { x: 300, y: 50 };

      // Draw branch connections for linked tree children
      if (node.left && coords[node.left] && coords[node.left].isTree) {
        const lc = coords[node.left];
        svgLines += `
          <line x1="${c.x}" y1="${c.y + 20}" x2="${lc.x}" y2="${lc.y - 20}" stroke="#58A6FF" stroke-width="2" />
          <text x="${Math.round((c.x + lc.x) / 2) - 14}" y="${Math.round((c.y + lc.y) / 2)}" fill="#58A6FF" font-size="10" font-weight="700" font-family="monospace">L</text>`;
      }
      if (node.right && coords[node.right] && coords[node.right].isTree) {
        const rc = coords[node.right];
        svgLines += `
          <line x1="${c.x}" y1="${c.y + 20}" x2="${rc.x}" y2="${rc.y - 20}" stroke="#58A6FF" stroke-width="2" />
          <text x="${Math.round((c.x + rc.x) / 2) + 6}" y="${Math.round((c.y + rc.y) / 2)}" fill="#58A6FF" font-size="10" font-weight="700" font-family="monospace">R</text>`;
      }

      let highlightClass = '';
      if (compared.has(nid)) highlightClass = 'compared';
      else if (modified.has(nid)) highlightClass = 'modified';
      else if (accessed.has(nid)) highlightClass = 'accessed';
      else if (created.has(nid)) highlightClass = 'created';

      if (c.isUnattached) {
        highlightClass += ' unattached-staged';
      }

      // Collect attached pointer labels
      const attachedPtrs = [];
      for (const [pName, pTarget] of Object.entries(pointers)) {
        if (pTarget === nid) {
          attachedPtrs.push(pName);
        }
      }

      const isRoot = (nid === rootId);

      let tagHtml = '';
      if (c.isUnattached) {
        tagHtml = `<span class="bst-staging-tag">${escapeHtml(c.ptrName || 'ALLOCATED')}</span>`;
      } else if (isRoot) {
        tagHtml = '<span class="bst-root-tag">ROOT</span>';
      } else if (attachedPtrs.length > 0) {
        tagHtml = `<div class="bst-ptr-tags">${attachedPtrs.map(p => `<span class="bst-ptr-badge">${escapeHtml(p)}</span>`).join('')}</div>`;
      }

      nodesHtml += `
        <div class="bst-node-card ${highlightClass}" id="bst_node_${nid}" style="left: ${c.x - 29}px; top: ${c.y - 29}px;" title="${escapeHtml(node.id)} (addr: ${node.addr || ''})">
          ${tagHtml}
          <div class="bst-node-val">${node.val}</div>
          <div class="bst-node-addr">${node.addr || ''}</div>
        </div>`;
    });

    const hasStaged = unattachedNodes.length > 0;

    viewportEl.innerHTML = `
      <div class="viz-wrapper bst-viz-wrapper">
        <div class="viz-meta-header">
          <span>Structure: <strong>Binary Search Tree (BST)</strong></span>
          <span>Root: <strong>${rootId}</strong></span>
          <span>Total Nodes: <strong>${nodes.length}</strong></span>
          ${hasStaged ? `<span class="status-warning-badge" style="background:#0E639C;">1 Node Staged / Unlinked</span>` : ''}
        </div>
        <div class="bst-stage-canvas" style="position: relative; width: 600px; height: 320px; margin: 0 auto;">
          <svg width="600" height="320" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            ${svgLines}
          </svg>
          ${nodesHtml}
          ${hasStaged ? `<div class="bst-staging-zone"><span class="bst-staging-zone-label">Allocated Node in Heap (Awaiting Link)</span></div>` : ''}
        </div>
      </div>`;
  }

  // --- 5B. Multiplication Table Visualization ---
  function renderMultiplicationTable(viewportEl, mem, step) {
    const vars = step?.variables || {};
    const num = mem.num !== undefined ? mem.num : (vars.num !== undefined ? vars.num : 5);
    const rawI = mem.i !== undefined ? mem.i : (vars.i !== undefined ? vars.i : 1);
    const elements = mem.elements || [];
    const capacity = mem.capacity || (elements.length > 0 ? elements.length : 6);
    const maxRows = Math.max(capacity, 6);
    // If the loop finished (e.g. i=11 on a 10-step loop), clamp display multiplier to maxRows
    const currentI = Math.min(rawI, maxRows);
    const currentProd = mem.prod !== undefined ? (rawI > maxRows ? num * maxRows : mem.prod) : (vars.prod !== undefined ? vars.prod : (num * currentI));
    const modified = new Set(mem.highlight_indices?.modified || []);

    let rowsHtml = '';
    for (let k = 1; k <= maxRows; k++) {
      const isCurrent = (k === rawI);
      const isComputed = (k < rawI) || (k === rawI && (vars.prod !== undefined || rawI > maxRows)) || (rawI > maxRows);
      const rowVal = (elements && elements[k - 1] !== undefined && elements[k - 1] !== 0) ? elements[k - 1] : (isComputed ? num * k : '—');

      let rowClass = 'mult-row-card';
      if (isCurrent && rawI <= maxRows) rowClass += ' active-row';
      else if (isComputed) rowClass += ' computed-row';
      else rowClass += ' pending-row';

      rowsHtml += `
        <div class="${rowClass}">
          <span class="row-expr">${num} × ${k}</span>
          <span class="row-arrow">→</span>
          <span class="row-result">${rowVal}</span>
        </div>`;
    }

    let arrayTrackHtml = '';
    if (mem.name === 'table' || (elements.length > 0 && mem.type === 'multiplication_table')) {
      arrayTrackHtml = `
        <div class="mult-array-section">
          <div class="mult-grid-title">Array Buffer: <strong>${escapeHtml(mem.name || 'table')}[${maxRows}]</strong></div>
          <div class="mult-cells-scroll-wrapper">
            <div class="array-cells-track">`;
      for (let idx = 0; idx < maxRows; idx++) {
        const val = elements[idx] !== undefined ? elements[idx] : 0;
        const isMod = modified.has(idx) || (idx === rawI - 1);
        const isPointerActive = (idx === rawI - 1 && rawI <= maxRows);
        arrayTrackHtml += `
          <div class="array-cell-unit">
            ${isPointerActive ? `<div class="cell-pointer-tag">i - 1 (${idx})</div>` : ''}
            <div class="array-cell-box ${isMod ? 'modified' : ''}" id="cell_${idx}" title="${escapeHtml(mem.name || 'table')}[${idx}] = ${val}">
              <span class="cell-val">${val}</span>
              <span class="cell-offset">+0x${(idx * 4).toString(16).toUpperCase().padStart(2, '0')}</span>
            </div>
            <span class="cell-index-label">[${idx}]</span>
          </div>`;
      }
      arrayTrackHtml += `</div></div></div>`;
    }

    viewportEl.innerHTML = `
      <div class="viz-wrapper mult-viz-wrapper">
        <div class="viz-meta-header">
          <span>Structure: <strong>Multiplication Table</strong></span>
          <span>Base Number: <strong>${num}</strong></span>
          <span>Multiplier (i): <strong>${currentI}</strong></span>
          <span>Current Product: <strong>${currentProd}</strong></span>
        </div>

        <div class="mult-equation-card">
          <div class="mult-term-box base-num">
            <span class="term-label">Base</span>
            <span class="term-val">${num}</span>
          </div>
          <span class="mult-op-symbol">×</span>
          <div class="mult-term-box multiplier">
            <span class="term-label">Multiplier (i)</span>
            <span class="term-val">${currentI}</span>
          </div>
          <span class="mult-op-symbol">=</span>
          <div class="mult-term-box product">
            <span class="term-label">Product (prod)</span>
            <span class="term-val">${currentProd}</span>
          </div>
        </div>

        ${arrayTrackHtml}

        <div class="mult-grid-container">
          <div class="mult-grid-title">Multiplication Sequence Progress</div>
          <div class="mult-table-grid">
            ${rowsHtml}
          </div>
        </div>
      </div>`;
  }

  // --- 6. Searching & Sorting Visualization ---
  function renderSearchSort(viewportEl, mem) {
    const elements = mem.elements || [];
    const pointers = mem.highlight_indices?.pointers || {};
    const comparison = mem.comparison;
    const target = mem.target;
    const foundIndex = mem.foundIndex;

    const comparedIdxs = new Set();
    if (comparison) {
      if (comparison.idx1 !== undefined) comparedIdxs.add(comparison.idx1);
      if (comparison.idx2 !== undefined) comparedIdxs.add(comparison.idx2);
    }

    let comparisonBanner = '';
    if (comparison && comparison.result !== null) {
      comparisonBanner = `
        <div class="algorithm-status-card">
          <span>Comparing: <code>arr[${comparison.idx1}] (${comparison.val1}) ${comparison.op || '>'} arr[${comparison.idx2}] (${comparison.val2})</code></span>
          <span class="compare-outcome ${comparison.result ? 'swap-true' : 'swap-false'}">
            Result: ${comparison.result ? 'TRUE (SWAP NEEDED)' : 'FALSE (NO SWAP)'}
          </span>
        </div>`;
    } else if (target !== null && target !== undefined) {
      comparisonBanner = `
        <div class="algorithm-status-card">
          <span>Target: <strong>${target}</strong></span>
          <span>${foundIndex !== -1 && foundIndex !== null ? `<strong style="color:var(--color-success)">FOUND AT INDEX [${foundIndex}]!</strong>` : 'Scanning...'}</span>
        </div>`;
    }

    let html = `
      <div class="viz-wrapper search-sort-viz-wrapper">
        <div class="viz-meta-header">
          <span>Algorithm Execution</span>
          <span>Array Size: <strong>${elements.length}</strong></span>
        </div>

        ${comparisonBanner}

        <div class="array-cells-track" style="margin-top: 16px;">`;

    for (let i = 0; i < elements.length; i++) {
      const val = elements[i];
      const isCompared = comparedIdxs.has(i);
      const isFound = (foundIndex === i);

      const activePtrs = [];
      for (const [pName, pVal] of Object.entries(pointers)) {
        if (VALID_INDEX_POINTERS.has(pName) && pVal === i) {
          activePtrs.push(pName);
        }
      }

      let highlightClass = '';
      if (isFound) highlightClass = 'found-target';
      else if (isCompared) highlightClass = 'compared-element';

      html += `
        <div class="array-cell-unit">
          ${activePtrs.length > 0 ? `<div class="cell-pointer-tag">${escapeHtml(activePtrs.join(', '))}</div>` : ''}
          <div class="array-cell-box ${highlightClass}" id="cell_${i}">
            <span class="cell-val">${val}</span>
            <span class="cell-offset">[${i}]</span>
          </div>
          <span class="cell-index-label">idx: ${i}</span>
        </div>`;
    }

    html += `
        </div>
      </div>`;

    viewportEl.innerHTML = html;
  }

  // --- 7. Pattern Printing Visualization Panel ---
  function renderPattern(viewportEl, mem, step) {
    const grid = mem.grid || [];
    const currentRow = mem.currentRow !== undefined ? mem.currentRow : 0;
    const currentCol = mem.currentCol !== undefined ? mem.currentCol : -1;
    const currentChar = mem.currentChar || '';
    const loopVars = mem.loopVars || {};

    let varPills = '';
    for (const [k, v] of Object.entries(loopVars)) {
      varPills += `<span style="margin-left: 8px;"><code>${escapeHtml(k)} = ${escapeHtml(v)}</code></span>`;
    }

    let rowsHtml = '';
    if (grid.length === 0) {
      rowsHtml = `<div style="color:var(--text-muted); font-style:italic; padding: 12px;">Pattern output will be constructed row-by-row as loops execute...</div>`;
    } else {
      grid.forEach((rowArr, rIdx) => {
        let cellsHtml = '';
        rowArr.forEach((ch, cIdx) => {
          const isSpace = (ch === ' ' || ch === '');
          const isActive = (rIdx === currentRow && cIdx === currentCol);
          let cellClass = 'pattern-cell';
          if (isSpace) cellClass += ' space';
          if (isActive) cellClass += ' active-char';

          cellsHtml += `<span class="${cellClass}" id="pattern_cell_${rIdx}_${cIdx}" title="Row ${rIdx}, Col ${cIdx}: '${ch}'">${isSpace ? '·' : escapeHtml(ch)}</span>`;
        });

        rowsHtml += `
          <div class="pattern-row" id="pattern_row_${rIdx}">
            <span class="pattern-row-label">Row ${rIdx}:</span>
            ${cellsHtml}
          </div>`;
      });
    }

    viewportEl.innerHTML = `
      <div class="viz-wrapper pattern-viz-wrapper">
        <div class="pattern-meta-status">
          <span>Active Loop Iteration: <strong>Row ${currentRow}</strong></span>
          ${currentChar ? `<span>Symbol: <strong>'${escapeHtml(currentChar)}'</strong></span>` : ''}
          ${varPills}
        </div>

        <div class="pattern-grid-board">
          ${rowsHtml}
        </div>
      </div>`;
  }

  // --- 8. Intelligent Auto-Follow Visualization Viewport Following ---
  /**
   * Smoothly scrolls the viewport container to keep the active element visible.
   * Keeps surrounding context with margin and prevents fighting manual interaction.
   */
  function autoFollow(viewportEl) {
    if (!viewportEl) return;

    // Target selector for any active/highlighted element across all data structures
    const activeSelector = [
      '.array-cell-box.modified',
      '.array-cell-box.accessed',
      '.array-cell-box.compared-element',
      '.array-cell-box.found-target',
      '.ll-node-card.accessed',
      '.ll-node-card.modified',
      '.ll-node-card.created',
      '.ll-node-card.deleted',
      '.stack-block.modified',
      '.stack-block.accessed',
      '.queue-cell-box.modified',
      '.queue-cell-box.accessed',
      '.bst-node-card.compared',
      '.bst-node-card.modified',
      '.bst-node-card.accessed',
      '.bst-node-card.created',
      '.mult-row-card.active-row',
      '.pattern-cell.active-char'
    ].join(', ');

    const targetEl = viewportEl.querySelector(activeSelector);
    if (!targetEl) return;

    // Handle nested horizontal scroller (e.g. array cells in multiplication table or standard array track)
    const scrollParent = targetEl.closest('.mult-cells-scroll-wrapper') || targetEl.closest('.array-track-container');
    if (scrollParent) {
      const spRect = scrollParent.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      if (tRect.left < spRect.left + 24 || tRect.right > spRect.right - 24) {
        const desiredSpLeft = scrollParent.scrollLeft + (tRect.left - spRect.left) - (scrollParent.clientWidth / 2) + (tRect.width / 2);
        scrollParent.scrollTo({
          left: Math.max(0, desiredSpLeft),
          behavior: 'smooth'
        });
      }
    }

    const vRect = viewportEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();

    // Check if element is outside the visible viewport rect (or within margin)
    const marginX = 40;
    const marginY = 30;

    const isOffLeft = tRect.left < vRect.left + marginX;
    const isOffRight = tRect.right > vRect.right - marginX;
    const isOffTop = tRect.top < vRect.top + marginY;
    const isOffBottom = tRect.bottom > vRect.bottom - marginY;

    if (isOffLeft || isOffRight || isOffTop || isOffBottom) {
      // Calculate true relative scroll coordinates via getBoundingClientRect
      const desiredLeft = viewportEl.scrollLeft + (tRect.left - vRect.left) - (viewportEl.clientWidth / 2) + (tRect.width / 2);
      const desiredTop = viewportEl.scrollTop + (tRect.top - vRect.top) - (viewportEl.clientHeight / 2) + (tRect.height / 2);

      const prefersReducedMotion = (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

      viewportEl.scrollTo({
        left: Math.max(0, desiredLeft),
        top: Math.max(0, desiredTop),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }

  return {
    render,
    autoFollow,
    renderArray,
    renderLinkedList,
    renderStack,
    renderQueue,
    renderBST,
    renderSearchSort,
    renderPattern,
    renderMultiplicationTable
  };
});
