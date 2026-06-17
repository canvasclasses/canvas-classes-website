// AUTO-EXTRACTED from Ketcher's embedded functional-group library (ketcher-react
// bundle, group "Functional Groups"). Each `mol` is the authoritative molfile
// with the SUP S-group (collapsed abbreviation label) + SAP attachment point, so
// handing it to Ketcher's template tool reproduces the exact native behaviour:
// literature display + click-to-attach + valence balancing. Do not hand-edit.
//
// Exception: the first two entries (N₂⁺ diazonium, N=N azo) are hand-authored in
// the same native superatom format — Ketcher does not ship these two — built with
// a formatter validated to reproduce NO₂ byte-for-byte. The diazonium is –N⁺≡N
// (triple bond, +1 on the inner N); azo is the –N=N– bridge with two attachment
// points (attach one end, then bond the other to the second ring).

export interface FgTemplate { label: string; title: string; mol: string }

export const FG_TEMPLATES: FgTemplate[] = [
  {
    "label": "N₂⁺",
    "title": "Diazonium ion (–N⁺≡N)",
    "mol": "N2+\n  Canvas 2D\n\n  2  1  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0\n    0.8250    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  3  0  0  0  0\nM  CHG  1  1  1\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 N2+\nM  SAL   1  2  1  2\nM  SAP   1  1  1  0\nM  END"
  },
  {
    "label": "N=N",
    "title": "Azo group (–N=N– bridge; attaches one end, bond the other)",
    "mol": "N=N\n  Canvas 2D\n\n  2  1  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8250    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 N=N\nM  SAL   1  2  1  2\nM  SAP   1  2  1  0  2  0\nM  END"
  },
  {
    "label": "NO₂",
    "title": "Nitro",
    "mol": "NO2\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  1  0  0  0  0  0999 V2000\n   -6.6000    4.4000    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0\n   -5.8500    5.6990    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -5.8500    3.1010    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\nM  CHG  2   1   1   3  -1\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 NO2\nM  SAL   1 3   1   2   3\nM  SAP   1  1   1   0\nM  END"
  },
  {
    "label": "CN",
    "title": "Nitrile",
    "mol": "CN\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  2  1  0  0  1  0  0  0  0  0999 V2000\n   -4.4500    5.0500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.9500    5.0500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  3  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 CN\nM  SAL   1 2   1   2\nM  SAP   1  1   1   0\nM  END"
  },
  {
    "label": "CO₂H",
    "title": "Carboxylic acid",
    "mol": "CO2H\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n   13.6876   -8.3811    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.4041   -7.9673    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   12.9709   -7.9673    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  3   1   2   3\nM  SAP   1  1   1   0\nM  SMT   1 CO2H\nM  END"
  },
  {
    "label": "CO₂Me",
    "title": "Methyl ester",
    "mol": "CO2Me\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  0  0  0  0  0  0999 V2000\n    8.4852   -6.1758    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2023   -5.7617    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9195   -6.1757    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.7680   -5.7617    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  1  4  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  4   1   2   3   4\nM  SAP   1  1   1   0\nM  SMT   1 CO2Me\nM  END"
  },
  {
    "label": "CONH₂",
    "title": "Amide",
    "mol": "CONH2\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  1  0  0  0  0  0999 V2000\n   -7.8000    3.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -7.0500    4.5490    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -7.0500    1.9510    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 CONH2\nM  SAL   1 3   1   2   3\nM  SAP   1  1   1   0\nM  END"
  },
  {
    "label": "OMe",
    "title": "Methoxy",
    "mol": "OMe\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  2  1  0  0  0  0  0  0  0  0999 V2000\n   13.9934   -7.9675    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   13.2774   -8.3809    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  2   1   2\nM  SAP   1  1   1   0\nM  SMT   1 OMe\nM  END"
  },
  {
    "label": "OEt",
    "title": "Ethoxy",
    "mol": "OEt\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n   14.3514   -7.9669    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6354   -8.3803    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.9194   -7.9669    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  2  3  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  3   1   2   3\nM  SAP   1  1   1   0\nM  SMT   1 OEt\nM  END"
  },
  {
    "label": "OAc",
    "title": "Acetoxy",
    "mol": "OAc\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  1  0  0  0  0  0999 V2000\n   -8.0010    2.5000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -6.7019    3.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -5.4029    2.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -6.7019    4.7500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  2  4  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 OAc\nM  SAL   1 4   1   2   3   4\nM  SAP   1  1   1   0\nM  END"
  },
  {
    "label": "Ph",
    "title": "Phenyl",
    "mol": "Ph\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  6  6  0  0  0  0  0  0  0  0999 V2000\n   14.3985   -7.7114    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.3985   -8.5387    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6865   -8.9516    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.9682   -8.5424    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.9682   -7.7118    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6847   -7.2984    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  2  0  0  0  0\n  3  2  1  0  0  0  0\n  4  3  2  0  0  0  0\n  5  4  1  0  0  0  0\n  6  5  2  0  0  0  0\n  1  6  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  6   1   2   3   4   5   6\nM  SAP   1  1   1   0\nM  SMT   1 Ph\nM  END"
  },
  {
    "label": "SO₃H",
    "title": "Sulfonic acid",
    "mol": "SO3H\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  1  0  0  0  0  0999 V2000\n   -1.2500    0.8500    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.2500    2.3500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.2500   -0.6500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.2500    0.8500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  2  0  0  0  0\n  1  4  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SMT   1 SO3H\nM  SAL   1 4   1   2   3   4\nM  SAP   1  1   1   0\nM  END"
  },
  {
    "label": "CF₃",
    "title": "Trifluoromethyl",
    "mol": "CF3\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  0  0  0  0  0  0999 V2000\n    3.7449   -7.2954    0.0000 C   0  0  3  0  0  0  0  0  0  0  0  0\n    3.7449   -6.5524    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    4.5875   -7.2954    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9179   -7.2954    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  4   1   2   3   4\nM  SAP   1  1   1   0\nM  SMT   1 CF3\nM  END"
  },
  {
    "label": "CCl₃",
    "title": "Trichloromethyl",
    "mol": "CCl3\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  0  0  0  0  0  0999 V2000\n    3.7449   -7.2954    0.0000 C   0  0  3  0  0  0  0  0  0  0  0  0\n    3.7449   -6.5524    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    4.5875   -7.2954    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    2.9179   -7.2954    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  4   1   2   3   4\nM  SAP   1  1   1   0\nM  SMT   1 CCl3\nM  END"
  },
  {
    "label": "Ac",
    "title": "Acetyl",
    "mol": "Ac\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n    3.3951   -3.5754    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6785   -3.9891    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.3951   -2.7480    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  1  3  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  3   1   2   3\nM  SAP   1  1   1   0\nM  SMT   1 Ac\nM  END"
  },
  {
    "label": "Et",
    "title": "Ethyl",
    "mol": "Et\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  2  1  0  0  0  0  0  0  0  0999 V2000\n   13.3295   -8.3317    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.0455   -7.9183    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nG    1  0\nEt\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  2   1   2\nM  SAP   1  1   1   0\nM  SMT   1 Et\nM  END"
  },
  {
    "label": "t-Bu",
    "title": "tert-Butyl",
    "mol": "tBu\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  0  0  0  0  0  0999 V2000\n   13.6875   -8.7451    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1875   -8.7451    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.1875   -8.7451    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6875   -8.2451    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\nG    1  0\ntBu\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  4   1   2   3   4\nM  SAP   1  1   1   0\nM  SMT   1 tBu\nM  END"
  },
  {
    "label": "i-Pr",
    "title": "Isopropyl",
    "mol": "iPr\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n   16.5000  -12.5433    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.7840  -12.9567    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.2160  -12.9567    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  1  3  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  3   1   2   3\nM  SAP   1  1   1   0\nM  SMT   1 iPr\nM  END"
  },
  {
    "label": "Ts",
    "title": "Tosyl",
    "mol": "Ts\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n 10 10  0  0  0  0  0  0  0  0999 V2000\n    9.2500   -9.7293    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2500   -8.9027    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.5318   -8.4935    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.5318   -7.6629    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2483   -7.2495    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9619   -7.6625    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9619   -8.4898    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2483   -6.4223    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.0768   -9.7293    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.4232   -9.7293    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  3  2  2  0  0  0  0\n  4  3  1  0  0  0  0\n  5  4  2  0  0  0  0\n  6  5  1  0  0  0  0\n  7  6  2  0  0  0  0\n  2  7  1  0  0  0  0\n  5  8  1  0  0  0  0\n  1  9  2  0  0  0  0\n  1 10  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1 10   1   2   3   4   5   6   7   8   9  10\nM  SAP   1  1   1   0\nM  SMT   1 Ts\nM  END"
  },
  {
    "label": "Ms",
    "title": "Mesyl",
    "mol": "Ms\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  4  3  0  0  0  0  0  0  0  0999 V2000\n   13.6876   -8.4891    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6876   -7.6625    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.5143   -8.4891    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8607   -8.4891    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  1  3  2  0  0  0  0\n  1  4  2  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  4   1   2   3   4\nM  SAP   1  1   1   0\nM  SMT   1 Ms\nM  END"
  },
  {
    "label": "NHPh",
    "title": "Anilino",
    "mol": "NHPh\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  7  7  0  0  0  0  0  0  0  0999 V2000\n    6.5715   -5.1888    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7479   -5.1888    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3322   -4.4689    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.5051   -4.4689    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.0946   -5.1877    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.5086   -5.9047    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3338   -5.9047    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  3  4  2  0  0  0  0\n  2  3  1  0  0  0  0\n  7  2  2  0  0  0  0\n  6  7  1  0  0  0  0\n  5  6  2  0  0  0  0\n  4  5  1  0  0  0  0\n  1  2  1  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  7   1   2   3   4   5   6   7\nM  SAP   1  1   1   0\nM  SMT   1 NHPh\nM  END"
  },
  {
    "label": "SCN",
    "title": "Thiocyanate",
    "mol": "SCN\nKetcher 11161713142D 1   1.00000     0.00000     0\n\n  3  2  0  0  0  0  0  0  0  0999 V2000\n    4.9851   -6.8125    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8125   -6.8125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.6399   -6.8125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  3  0  0  0  0\nG    1  0\nM  STY  1   1 SUP\nM  SLB  1   1   1\nM  SAL   1  3   1   2   3\nM  SAP   1  1   1   0\nM  SMT   1 SCN\nM  END"
  }
];
