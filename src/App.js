import React, {useState} from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './App.css';
const App = () => {
    const [numNodes, setNumNodes] = useState(0);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [graphVisible, setGraphVisible] = useState(false);
    const [linkSource, setLinkSource] = useState('');
    const [linkTarget, setLinkTarget] = useState('');
    const [nodeColors, setNodeColors] = useState([]);
    const handleNodeCountChange = (e) => {
        const count = parseInt(e.target.value, 10) || 0;
        setNumNodes(count);
        setNodes(new Array(count).fill('').map((_, index) => ({ id: index + 1, label: `گره ${index + 1}`})));
        setLinks([]);
        setNodeColors(new Array(count).fill('').map(() => getRandomColor()));
    };
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const greedyGraphColoring = () => {
        const colors = new Array(numNodes).fill(-1); // -1 indicates no color assigned
        for (let nodeIndex = 0; nodeIndex < numNodes; nodeIndex++) {
            const neighbors = getNeighbors(nodeIndex);
            const availableColors = new Set(nodeColors); // Initialize with all node colors
            neighbors.forEach((neighborIndex) => {
                if (colors[neighborIndex] !== -1) {
                    availableColors.delete(colors[neighborIndex]);
                }
            });
            colors[nodeIndex] = Array.from(availableColors)[0];
        }
        return colors;
    };
    const getNeighbors = (nodeIndex) => {
        return links
            .filter((link) => link.source === nodeIndex + 1 || link.target === nodeIndex + 1)
            .map((link) => (link.source === nodeIndex + 1 ? link.target - 1 : link.source - 1));
    };
    const handleYalSubmit = () => {
        if (!linkSource || !linkTarget) {
            alert('لطفاً گره‌های مبدا و مقصد را انتخاب کنید.');
            return;
        }
        const sourceNodeIndex = parseInt(linkSource, 10) - 1;
        const targetNodeIndex = parseInt(linkTarget, 10) - 1;
        if (sourceNodeIndex < 0 || sourceNodeIndex >= numNodes || targetNodeIndex < 0 || targetNodeIndex >= numNodes) {
            alert('شماره گره‌ها معتبر نیست. لطفاً شماره گره‌های معتبر وارد کنید.');
            return;
        }
        const newLink = {
            source: sourceNodeIndex + 1,
            target: targetNodeIndex + 1,
        };
        setLinks((prevLinks) => [...prevLinks, newLink]);
        setLinkSource('');
        setLinkTarget('');
    };
    const handleShowGraph = () => {
        const nodeColorsResult = greedyGraphColoring();
        setNodeColors(nodeColorsResult);
        setGraphVisible(true);
    };
    return (
        <div className="container">
            <div>
                <label>
                    تعداد گره‌ها:
                    <input type="number" min="1" onChange={handleNodeCountChange} />
                </label>
            </div>
            {nodes.map((node, index) => (
                <div key={node.id} className=" node-label">
                    <label>
                        نام گره {node.id}:
                        <input
                            type="text"
                            value={node.label}
                            onChange={(e) => {
                                const updatedNodes = [...nodes];
                                updatedNodes[index].label = e.target.value;
                                setNodes(updatedNodes);
                            }}
                        />
                    </label>
                </div>
            ))}
            <div className={'margin-top'}>
                <label className={'destination'}>
                    گره مقصد
                    <input type="number" min="1" value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} />
                </label>
                <label className={'destination'}>
                    گره مبدا
                    <input type="number" min="1" value={linkSource} onChange={(e) => setLinkSource(e.target.value)} />
                </label>
                <button type="button" onClick={handleYalSubmit}>
                    تعیین یال
                </button>
            </div>
            <button type="button" onClick={handleShowGraph} className="show-graph-button">
                نمایش گراف
            </button>
            {graphVisible && (
                <div className="graph-container">
                    <ForceGraph2D graphData={{ nodes, links }} nodeLabel={(node) => node.label} nodeColor={(node) => nodeColors[node.id - 1]} linkColor={() => 'gray'} />
                </div>
            )}
        </div>
    );
};
export default App;