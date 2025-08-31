import React, { useCallback } from 'react';

export default function Dropzone({ onFile }: { onFile: (f: File) => void }) {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }, [onFile]);

  return (
    <label style={{
      display: 'grid', placeItems: 'center',
      height: 180, border: '2px dashed #bbb', borderRadius: 16, cursor: 'pointer', margin: '1rem 0'
    }}>
      <input type="file" accept="image/*" onChange={onChange} hidden />
      <span>Click to upload a floorplan image</span>
    </label>
  );
}