'use client';

import React, { useEffect, useState } from 'react';
import * as OCL from 'openchemlib';

interface MoleculeViewerProps {
    smiles?: string;
    svg?: string; // New: Support raw SVG strings
    width?: number;
    height?: number;
    className?: string;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({
    smiles,
    svg,
    width = 250, // Increased default
    height = 200, // Increased default
    className = ''
}) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (svg) {
            setSvgContent(svg);
            setError(false);
            return;
        }

        if (!smiles) return;

        try {
            // Using OCL.Molecule ensures compatibility if named exports fail
            // Fallback used because sometimes OCL is the module, sometimes it's the default export
            const Molecule = OCL.Molecule || (OCL as any).default?.Molecule || (OCL as any);
            const molecule = Molecule.fromSmiles(smiles);

            // Configure rendering to show terminal METHYL groups (CH3) only.
            // We avoid labeling rings (Benzene) or internal chain atoms to preserve bond lines and clear double bonds.
            molecule.inventCoordinates(); // Ensure clean 2D layout

            // Attempt to increase bond length perception
            // OCL toSVG auto-scales, so we can't just set length.
            // However, ensuring clean coordinates helps.

            const atomCount = molecule.getAllAtoms();
            for (let i = 0; i < atomCount; i++) {
                if (molecule.getAtomicNo(i) === 6) { // Carbon
                    // Skip if it's in a ring (Benzene, Cyclohexane)
                    if (molecule.isRingAtom(i)) continue;

                    // Only label terminal Methyl groups (CH3)
                    // Terminal Alkenes (=CH2) remain bond-line for clear double bonds
                    // Internal carbons (CH2, CH) remain bond-line
                    if (molecule.getConnAtoms(i) === 1) {
                        const implicitH = molecule.getImplicitHydrogens(i);
                        if (implicitH === 3) {
                            molecule.setAtomCustomLabel(i, "CH3");
                        }
                    }
                }
            }

            const svg = molecule.toSVG(width, height);

            // Post-process SVG string for chalk styling AND pastel colors
            // WE reduce font size to make bonds look relatively longer
            const styledSvg = svg
                .replace(/stroke="rgb\(0,0,0\)"/g, 'stroke="white" stroke-width="2"')
                .replace(/fill="rgb\(0,0,0\)"/g, 'fill="white"')
                .replace(/<rect[^>]*fill="white"[^>]*\/>/g, '') // Remove white background rect
                .replace(/font-family="Helper"/g, 'font-family="Comic Sans MS", cursive')
                .replace(/font-size="[0-9]+px"/g, 'font-size="11px"') // Reduce font size? OCL usually outputs generic sans. We force 11px.
                .replace(/<rect x="0" y="0" width=".*" height=".*" opacity="1.0" fill="rgb\(255,255,255\)" \/>/g, '')
                // Pastel Colors Replacement for Dark Mode visibility
                // Regex handles optional spaces in rgb(r, g, b)
                .replace(/rgb\(\s*255\s*,\s*0\s*,\s*0\s*\)/g, '#ff8787')     // Oxygen Red -> Lighter Pastel Red
                .replace(/rgb\(\s*0\s*,\s*0\s*,\s*255\s*\)/g, '#74c0fc')     // Nitrogen Blue -> Lighter Pastel Blue
                .replace(/rgb\(\s*0\s*,\s*200\s*,\s*0\s*\)/g, '#69db7c')     // Chlorine Green -> Lighter Pastel Green
                .replace(/rgb\(\s*0\s*,\s*255\s*,\s*0\s*\)/g, '#69db7c')
                .replace(/rgb\(\s*128\s*,\s*0\s*,\s*128\s*\)/g, '#da77f2')   // Iodine Purple -> Lighter Pastel Purple
                .replace(/rgb\(\s*148\s*,\s*0\s*,\s*211\s*\)/g, '#da77f2')
                .replace(/rgb\(\s*165\s*,\s*42\s*,\s*42\s*\)/g, '#ffc078')   // Bromine Brown -> Lighter Pastel Orange
                .replace(/rgb\(\s*255\s*,\s*165\s*,\s*0\s*\)/g, '#ffe066');  // Phosphorus/Sulfur -> Lighter Pastel Yellow

            setSvgContent(styledSvg);
            setError(false);
        } catch (e: any) {
            console.error("OpenChemLib Error for SMILES:", smiles, e);
            setError(true);
        }
    }, [smiles, svg, width, height]);

    if (error) {
        return (
            <div className={`flex items-center justify-center text-red-400 text-xs ${className}`} style={{ width, height }}>
                Invalid Structure
            </div>
        );
    }

    return (
        <div
            className={`relative ${className} select-none flex items-center justify-center`}
            style={{ width, height }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default MoleculeViewer;
