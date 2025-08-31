import { useState } from 'react';
import Dropzone from './components/Dropzone';
import ImageCompare from './components/ImageCompare';
import { renderFloorplan } from './api';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [viewpoint, setViewpoint] = useState('living room, looking north wall');
  const [style, setStyle] = useState('natural daylight, neutral walls');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onRender = async () => {
    if (!file) return;
    setBusy(true); setErr(null); setOutUrl(null);
    try {
      const url = await renderFloorplan({ image: file, viewpoint, style });
      setOutUrl(url);
    } catch (e: any) {
      setErr(e.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem', fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Floorplan → Interior Perspective</h1>
      <p style={{ color: '#666' }}>Upload a 2D floorplan and generate a plausible ground-level interior view.</p>

      <Dropzone onFile={setFile} />

      <div style={{ display: 'grid', gap: 8 }}>
        <input value={viewpoint} onChange={e => setViewpoint(e.target.value)} placeholder="e.g., kitchen entrance, facing stove" />
        <input value={style} onChange={e => setStyle(e.target.value)} placeholder="style hints (optional)" />
      </div>

      <button onClick={onRender} disabled={!file || busy} style={{ marginTop: 12, padding: '10px 16px', borderRadius: 12, border: 'none', background: 'black', color: 'white' }}>
        {busy ? 'Generating…' : 'Generate'}
      </button>

      {err && <pre style={{ color: '#b00020', whiteSpace: 'pre-wrap' }}>{err}</pre>}

      <ImageCompare a={file ? URL.createObjectURL(file) : undefined} b={outUrl || undefined} />

      <footer style={{ marginTop: 24 }}>
        <small>For research/demo only. Do not use for surveillance or impersonation.</small>
      </footer>
    </div>
  );
}