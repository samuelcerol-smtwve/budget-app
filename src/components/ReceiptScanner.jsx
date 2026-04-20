import { useState, useRef } from 'react';
import { getIcon } from '../lib/icons';

export default function ReceiptScanner({ onResult, envelopes }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError('');

    try {
      const base64 = await fileToBase64(file);
      const mediaType = file.type || 'image/jpeg';

      const res = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur de scan');
      }

      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError(err.message || 'Impossible de lire le ticket');
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="mb-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        id="receipt-input"
      />
      <button
        type="button"
        disabled={scanning}
        onClick={() => fileRef.current?.click()}
        className="w-full py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
        style={{ background: 'rgba(216, 151, 106, 0.15)', color: '#D8976A' }}
      >
        {scanning ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            {getIcon('camera', { size: 16, color: '#D8976A' })}
            Scanner un ticket
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm p-2.5 rounded-xl" style={{ color: '#D89478', background: 'rgba(216, 148, 120, 0.1)' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
