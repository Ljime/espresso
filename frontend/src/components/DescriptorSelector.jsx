import { useState } from 'react';
import { SCA_WHEEL } from '../data/sca.js';

export default function DescriptorSelector({ descriptors, onChange, lens }) {
  const [l1, setL1] = useState(null);
  const [l2, setL2] = useState(null);

  const l1Node = SCA_WHEEL.find(n => n.id === l1);
  const l2Node = l1Node?.children.find(n => n.id === l2);

  function addDescriptor(id, label, color, l1Label, l2Label) {
    if (descriptors.find(d => d.sca_id === id)) return; // already added
    onChange([...descriptors, {
      sca_id: id,
      label,
      color,
      l1: l1Label,
      l2: l2Label || null,
      intensity: 3,
      timestamp: new Date().toISOString(),
    }]);
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
      {/* Added descriptor tags */}
      {descriptors.length > 0 && (
        <div className="descriptor-tags">
          {descriptors.map(d => (
            <div key={d.sca_id} className="descriptor-tag" style={{ '--tag-color': d.color }}>
              <span className="tag-label">{d.label}</span>
              <span className="tag-l1">
                {d.l1}{d.l2 ? ` › ${d.l2}` : ''}
              </span>
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

      <div className="picker-row">
        {/* L1 column */}
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

        {/* L2 column — shown when L1 selected */}
        {l1Node && (
          <div className="picker-col">
            <div className="picker-label-row">
              <span className="picker-label">Sub-category</span>
              {/* Add at L1 level */}
              <button
                className="btn-add-level"
                title={`Add "${l1Node.label}" as descriptor`}
                onClick={() => addDescriptor(l1Node.id, l1Node.label, l1Node.color, l1Node.label, null)}
              >
                + add "{l1Node.label}"
              </button>
            </div>
            <div className="picker-list">
              {l1Node.children.map(node => (
                <button
                  key={node.id}
                  className={`picker-item ${l2 === node.id ? 'active' : ''}`}
                  style={{ '--item-color': l1Node.color }}
                  onClick={() => {
                    if (!node.children || node.children.length === 0) {
                      // No L3 — add directly
                      addDescriptor(node.id, node.label, l1Node.color, l1Node.label, null);
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

        {/* L3 column — shown when L2 has children */}
        {l2Node && l2Node.children?.length > 0 && (
          <div className="picker-col">
            <div className="picker-label-row">
              <span className="picker-label">Descriptor</span>
              {/* Add at L2 level */}
              <button
                className="btn-add-level"
                title={`Add "${l2Node.label}" as descriptor`}
                onClick={() => addDescriptor(l2Node.id, l2Node.label, l1Node.color, l1Node.label, null)}
              >
                + add "{l2Node.label}"
              </button>
            </div>
            <div className="picker-list">
              {l2Node.children.map(leaf => (
                <button
                  key={leaf.id}
                  className="picker-item leaf"
                  style={{ '--item-color': l1Node.color }}
                  onClick={() => addDescriptor(leaf.id, leaf.label, l1Node.color, l1Node.label, l2Node.label)}
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
