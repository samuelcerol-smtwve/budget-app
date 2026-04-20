// Lucide-style SVG icons — stroke-width 1.5, 24x24 viewBox
// Rendered at 18px inside 38x38 cubes

const Icon = ({ d, size = 18, color = 'currentColor', strokeWidth = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const MultiPathIcon = ({ paths, size = 18, color = 'currentColor', strokeWidth = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

export const icons = {
  utensils: (props) => (
    <MultiPathIcon
      paths={[
        'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2',
        'M7 2v20',
        'M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7',
      ]}
      {...props}
    />
  ),
  coffee: (props) => (
    <MultiPathIcon
      paths={[
        'M17 8h1a4 4 0 1 1 0 8h-1',
        'M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z',
        'M6 2v2',
        'M10 2v2',
        'M14 2v2',
      ]}
      {...props}
    />
  ),
  gift: (props) => (
    <MultiPathIcon
      paths={[
        'M20 12v10H4V12',
        'M2 7h20v5H2z',
        'M12 22V7',
        'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
        'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
      ]}
      {...props}
    />
  ),
  heart: (props) => (
    <Icon
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      {...props}
    />
  ),
  shield: (props) => (
    <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...props} />
  ),
  'credit-card': (props) => (
    <MultiPathIcon
      paths={[
        'M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
        'M1 10h22',
      ]}
      {...props}
    />
  ),
  wallet: (props) => (
    <MultiPathIcon
      paths={[
        'M21 12V7H5a2 2 0 0 1 0-4h14v4',
        'M3 5v14a2 2 0 0 0 2 2h16v-5',
        'M18 12a2 2 0 0 0 0 4h4v-4Z',
      ]}
      {...props}
    />
  ),
  archive: (props) => (
    <MultiPathIcon
      paths={[
        'M21 8v13H3V8',
        'M1 3h22v5H1z',
        'M10 12h4',
      ]}
      {...props}
    />
  ),
  zap: (props) => (
    <Icon d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" {...props} />
  ),
  clock: (props) => (
    <MultiPathIcon
      paths={[
        'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
        'M12 6v6l4 2',
      ]}
      {...props}
    />
  ),
  'alert-circle': (props) => (
    <MultiPathIcon
      paths={[
        'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
        'M12 8v4',
        'M12 16h.01',
      ]}
      {...props}
    />
  ),
  plus: (props) => (
    <MultiPathIcon
      paths={['M12 5v14', 'M5 12h14']}
      {...props}
      strokeWidth={props?.strokeWidth || 2.5}
    />
  ),
  settings: (props) => (
    <MultiPathIcon
      paths={[
        'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
        'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      ]}
      {...props}
    />
  ),
  camera: (props) => (
    <MultiPathIcon
      paths={[
        'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
        'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      ]}
      {...props}
    />
  ),
  trash: (props) => (
    <MultiPathIcon
      paths={[
        'M3 6h18',
        'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
        'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      ]}
      {...props}
    />
  ),
  'log-out': (props) => (
    <MultiPathIcon
      paths={[
        'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
        'M16 17l5-5-5-5',
        'M21 12H9',
      ]}
      {...props}
    />
  ),
  download: (props) => (
    <MultiPathIcon
      paths={[
        'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
        'M7 10l5 5 5-5',
        'M12 15V3',
      ]}
      {...props}
    />
  ),
  'refresh-cw': (props) => (
    <MultiPathIcon
      paths={[
        'M21 2v6h-6',
        'M3 12a9 9 0 0 1 15-6.7L21 8',
        'M3 22v-6h6',
        'M21 12a9 9 0 0 1-15 6.7L3 16',
      ]}
      {...props}
    />
  ),
  sun: (props) => (
    <MultiPathIcon
      paths={[
        'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
        'M12 1v2', 'M12 21v2', 'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42',
        'M1 12h2', 'M21 12h2', 'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42',
      ]}
      {...props}
    />
  ),
  moon: (props) => (
    <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...props} />
  ),
  leaf: (props) => (
    <MultiPathIcon
      paths={[
        'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z',
        'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
      ]}
      {...props}
    />
  ),
  wine: (props) => (
    <MultiPathIcon
      paths={[
        'M8 22h8',
        'M12 11v11',
        'M17 5H7l1 7c.18 1.95 2.24 3 4 3s3.82-1.05 4-3l1-7z',
        'M7 5V2h10v3',
      ]}
      {...props}
    />
  ),
};

export function getIcon(name, props = {}) {
  const IconComponent = icons[name] || icons.wallet;
  return <IconComponent {...props} />;
}
