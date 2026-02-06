'use client';

interface ChemicalStructureProps {
    smiles: string;
    width?: number;
    height?: number;
    rotate?: number;
    theme?: 'light' | 'dark';
    className?: string;
}

export default function ChemicalStructure({
    smiles,
    width = 180,
    height = 120,
    rotate = 0,
    theme = 'dark',
    className = ''
}: ChemicalStructureProps) {
    const encodedSmiles = encodeURIComponent(smiles.trim());
    // Cache bust with timestamp to ensure latest renderer logic is loaded
    const src = `/mol-renderer.html?smiles=${encodedSmiles}&width=${width}&height=${height}&rotate=${rotate}&theme=${theme}&v=${Date.now()}`;

    return (
        <iframe
            src={src}
            style={{ width, height, border: 'none' }}
            className={`inline-block align-middle overflow-hidden ${className}`}
            scrolling="no"
            title={`Structure: ${smiles}`}
        />
    );
}
