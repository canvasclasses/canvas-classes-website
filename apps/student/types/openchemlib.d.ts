declare module 'openchemlib/full' {
    interface OCLModule {
        Molecule: {
            fromSmiles: (smiles: string) => {
                inventCoordinates: () => void;
                getAllAtoms: () => number;
                getAtomicNo: (index: number) => number;
                isRingAtom: (index: number) => boolean;
                getConnAtoms: (index: number) => number;
                getImplicitHydrogens: (index: number) => number;
                setAtomCustomLabel: (index: number, label: string) => void;
                toSVG: (width: number, height: number) => string;
            };
        };
    }
    const OCL: OCLModule;
    export default OCL;
}
