import { useState, useRef } from 'react';

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
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {scanning ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>📸 Scanner un ticket</>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
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
      // Retirer le préfixe "data:image/...;base64,"
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
