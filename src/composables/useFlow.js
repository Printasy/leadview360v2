import { ref, reactive } from 'vue';

// Global state (of per instance als je factory pattern gebruikt)
export function useFlow() {
    const nodes = ref([]);
    const connections = ref([]);
    const selectedNode = ref(null);
    const zoom = ref(1);
    const pan = reactive({ x: 0, y: 0 });

    // Node Types Configuratie
    const nodeTypes = [
        { id: 'multiple_choice', label: 'Multiple Choice', icon: 'list-ul' }, // Icons zijn strings, in component mappen we ze naar SVG
        { id: 'multi_select', label: 'Multi Select', icon: 'check-double' },
        { id: 'rating', label: 'Rating', icon: 'star' },
        { id: 'sentence', label: 'Open Vraag', icon: 'align-left' },
        { id: 'condition', label: 'Conditie', icon: 'code-branch' },
        { id: 'file_input', label: 'Bestand Upload', icon: 'upload' }
    ];

    // Acties
    const addNode = (type, x, y) => {
        const id = Date.now();
        const typeConfig = nodeTypes.find(t => t.id === type);

        nodes.value.push({
            id,
            type,
            typeLabel: typeConfig ? typeConfig.label : type,
            x,
            y,
            data: {
                question: '',
                required: false,
                options: ['Optie 1'],
                // Specifiek voor conditions
                conditionType: 'equals', // equals, contains, gt, gte, lt, lte
                conditionValue: '',
                // Specifiek voor files
                allowedTypes: [],
                maxSize: 5
            }
        });
    };

    const removeNode = (id) => {
        nodes.value = nodes.value.filter(n => n.id !== id);
        connections.value = connections.value.filter(c => c.from !== id && c.to !== id);
        if (selectedNode.value?.id === id) selectedNode.value = null;
    };

    const addConnection = (fromId, toId) => {
        if (fromId === toId) return;
        const exists = connections.value.some(c => c.from === fromId && c.to === toId);
        if (!exists) {
            connections.value.push({ id: Date.now(), from: fromId, to: toId });
        }
    };

    // Helper voor Bezier curves (SVG Paths)
    const getBezierPath = (x1, y1, x2, y2) => {
        const dist = Math.abs(y2 - y1);
        const controlOffset = Math.max(dist * 0.5, 50);
        return `M ${x1} ${y1} C ${x1} ${y1 + controlOffset}, ${x2} ${y2 - controlOffset}, ${x2} ${y2}`;
    };

    return {
        nodes,
        connections,
        selectedNode,
        zoom,
        pan,
        nodeTypes,
        addNode,
        removeNode,
        addConnection,
        getBezierPath
    };
}