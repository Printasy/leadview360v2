<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useFlow } from '@/composables/useFlow';
import FlowNode from './FlowNode.vue';

const { nodes, connections, selectedNode, zoom, pan, removeNode, addNode, addConnection, getBezierPath } = useFlow();

// State voor interacties
const dragData = ref(null); // Voor verplaatsen van nodes
const drawingLine = ref(false);
const lineStartNode = ref(null);
const tempPath = ref('');
const canvasRef = ref(null);

// --- 1. Nodes verplaatsen ---
const startNodeDrag = (event, node) => {
  dragData.value = {
    node,
    offsetX: event.clientX - node.x * zoom.value - pan.x,
    offsetY: event.clientY - node.y * zoom.value - pan.y
  };
};

// --- 2. Canvas Panning ---
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });

const startPan = (event) => {
  if (event.target === event.currentTarget || event.target.tagName === 'svg') {
    isPanning.value = true;
    panStart.value = { x: event.clientX - pan.x, y: event.clientY - pan.y };
  }
};

// --- 3. Lijnen tekenen ---
const startConnection = (event, nodeId) => {
  drawingLine.value = true;
  lineStartNode.value = nodeId;
};

const endConnection = (targetId) => {
  if (drawingLine.value && lineStartNode.value) {
    addConnection(lineStartNode.value, targetId);
  }
  stopInteraction();
};

// --- Global Mouse Move ---
const handleMouseMove = (event) => {
  // Pannen
  if (isPanning.value) {
    pan.x = event.clientX - panStart.value.x;
    pan.y = event.clientY - panStart.value.y;
    return;
  }

  // Node slepen
  if (dragData.value) {
    dragData.value.node.x = (event.clientX - dragData.value.offsetX - pan.x) / zoom.value;
    dragData.value.node.y = (event.clientY - dragData.value.offsetY - pan.y) / zoom.value;
    return;
  }

  // Lijn tekenen
  if (drawingLine.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const rawX = (event.clientX - rect.left - pan.x) / zoom.value;
    const rawY = (event.clientY - rect.top - pan.y) / zoom.value;

    const startNode = nodes.value.find(n => n.id === lineStartNode.value);
    if (startNode) {
      // 144 = helft van w-72 (288px), 140 = approx hoogte output port
      const startX = startNode.x + 144;
      const startY = startNode.y + 120; // Hardcoded approx port location
      tempPath.value = getBezierPath(startX, startY, rawX, rawY);
    }
  }
};

const stopInteraction = () => {
  isPanning.value = false;
  dragData.value = null;
  drawingLine.value = false;
  tempPath.value = '';
};

// --- Drop vanuit Sidebar ---
const handleDrop = (event) => {
  const typeId = event.dataTransfer.getData('nodeType');
  if (typeId) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom.value - 144; // Center
    const y = (event.clientY - rect.top - pan.y) / zoom.value - 20;
    addNode(typeId, x, y);
  }
};
</script>

<template>
  <div
      ref="canvasRef"
      class="flex-grow relative bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      @mousedown="startPan"
      @mousemove="handleMouseMove"
      @mouseup="stopInteraction"
      @dragover.prevent
      @drop="handleDrop"
  >
    <div class="absolute inset-0 origin-top-left pointer-events-none"
         :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }">

      <div class="absolute -top-[5000px] -left-[5000px] w-[10000px] h-[10000px] opacity-20 bg-grid"></div>

      <svg class="absolute top-0 left-0 w-full h-full overflow-visible z-0 pointer-events-none">
        <path v-for="conn in connections" :key="conn.id"
              :d="(() => {
                const start = nodes.find(n => n.id === conn.from);
                const end = nodes.find(n => n.id === conn.to);
                if(!start || !end) return '';
                return getBezierPath(start.x + 144, start.y + 130, end.x + 144, end.y - 12);
            })()"
              stroke="#cbd5e1" stroke-width="3" fill="none"
        />
        <path v-if="drawingLine" :d="tempPath" stroke="#14b8a6" stroke-width="3" stroke-dasharray="5,5" fill="none" />
      </svg>

      <div class="pointer-events-auto">
        <FlowNode
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :selected="selectedNode?.id === node.id"
            @select="selectedNode = $event"
            @delete="removeNode"
            @drag-start="startNodeDrag"
            @connect-start="startConnection"
            @connect-end="endConnection"
        />
      </div>
    </div>

    <div class="absolute bottom-6 left-6 flex bg-white dark:bg-slate-800 rounded-md shadow border border-slate-200 dark:border-slate-700 z-50">
      <button @click="zoom -= 0.1" class="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">-</button>
      <span class="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 flex items-center min-w-[3rem] justify-center border-x border-slate-200 dark:border-slate-700">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoom += 0.1" class="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">+</button>
    </div>
  </div>
</template>

<style scoped>
.bg-grid {
  background-size: 20px 20px;
  background-image:
      linear-gradient(to right, currentColor 1px, transparent 1px),
      linear-gradient(to bottom, currentColor 1px, transparent 1px);
  color: #e2e8f0; /* slate-200 */
}
:global(.dark) .bg-grid {
  color: #1e293b; /* slate-800 */
}
</style>