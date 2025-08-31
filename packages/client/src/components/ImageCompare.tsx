export default function ImageCompare({ a, b }: { a?: string; b?: string }) {
  if (!a || !b) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
      <div>
        <h3>Floorplan</h3>
        <img src={a} alt="floorplan" style={{ width: '100%', borderRadius: 12 }} />
      </div>
      <div>
        <h3>Interior Render</h3>
        <img src={b} alt="render" style={{ width: '100%', borderRadius: 12 }} />
      </div>
    </div>
  );
}