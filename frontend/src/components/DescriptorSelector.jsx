import { useState } from 'react';
import { SCA_WHEEL } from '../data/sca.js';

export default function DescriptorSelector({ descriptors, onChange, lens }) {
  const [l1, setL1] = useState(null);
  const [l2, setL2] = useState(null);

  const l1Node = SCA_WHEEL.find(n => n.id === l1);
  const l2Node = l1Node?.children.find(n => n.id === l2);
  const leafOptions = l2Node?.children?.length > 0 ? l2Node.children : l2Node ? [l2Node] : [];

  function addDescriptor(leaf, color, l1Label, l2Label) {
    const existing = descriptors.find(d => d.sca_id === leaf.id);
    if (existing) return; // already added
    const entry = {
      sca_id: leaf.id,
      label: leaf.label,
      color,
      l1: l1Label,
      l2: l2Label,
      intensity: 3,
      timestamp: new Date().toISOString(),
    };
    onChange([...descriptors, entry]);
    setL1(null);
    setL2(null);
  }

  function updateIntensity(id, val) {
    onChange(descriptors.map(d => d.sca_id === id ? { ...d, intensity: val } : d));
  }

  function remove(id) {
    onChange(descriptors.filter(d => d.sca_id !== id));
  }

  return (
    <div className="descriptor-selector">
      {/* Added descriptors */}
      {descriptors.length > 0 && (
        <div className="descriptor-tags">
          {descriptors.map(d => (
            <div key={d.sca_id} className="descriptor-tag" style={{ '--tag-color': d.color }}>
              <span className="tag-label">{d.label}</span>
              <span className="tag-l1">{d.l1}{d.l2 ? ` › ${d.l2}` : ''}</span>
              <div className="intensity-row">
                <span className="intensity-label">Intensity</span>
                <input
                  type="range" min="1" max="5" step="1"
                  value={d.intensity}
                  onChange={e => updateIntensity(d.sca_id, Number(e.target.value))}
                  className="intensity-slider"
                />
                <span className="intensity-val">{d.intensity}</span>
              </div>
              <button className="tag-remove" onClick={() => remove(d.sca_id)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Picker: L1 */}
      <div className="picker-row">
        <div className="picker-col">
          <div className="picker-label">Category</div>
          <div className="picker-list">
            {SCA_WHEEL.map(node => (
              <button
                key={node.id}
                className={`picker-item ${l1 === node.id ? 'active' : ''}`}
                style={{ '--item-color': node.color }}
                onClick={() => { setL1(node.id); setL2(null); }}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>

        {/* L2 */}
        {l1Node && l1Node.children.length > 0 && (
          <div className="picker-col">
            <div className="picker-label">Sub-category</div>
            <div className="picker-list">
              {l1Node.children.map(node => (
                <button
                  key={node.id}
                  className={`picker-item ${l2 === node.id ? 'active' : ''}`}
                  style={{ '--item-color': l1Node.color }}
                  onClick={() => {
                    if (!node.children || node.children.length === 0) {
                      addDescriptor(node, l1Node.color, l1Node.label, null);
                    } else {
                      setL2(node.id);
                    }
                  }}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* L3 */}
        {l2Node && l2Node.children?.length > 0 && (
          <div className="picker-col">
            <div className="picker-label">Descriptor</div>
            <div className="picker-list">
              {l2Node.children.map(leaf => (
                <button
                  key={leaf.id}
                  className="picker-item leaf"
                  style={{ '--item-color': l1Node.color }}
                  onClick={() => addDescriptor(leaf, l1Node.color, l1Node.label, l2Node.label)}
                >
                  {leaf.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
