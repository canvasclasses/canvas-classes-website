# features/simulations

Interactive chemistry/physics simulators spanning 11 routes. This is the
biggest feature surface by file count and conceptually contains many distinct
simulators that share a small core of cross-route helpers.

## Routes

| Route | What it is |
|---|---|
| `/chemihex` | Hex-grid reaction puzzle |
| `/salt-analysis` | Inorganic salt identification quiz |
| `/solubility-product-ksp-calculator` | Ksp calculator |
| `/organic-wizard` | Multi-step organic conversion game (+ admin) |
| `/organic-chemistry-hub` | Acidity/basicity/SN1-SN2 labs |
| `/inorganic-chemistry-hub` | VSEPR + bond-angle simulators |
| `/physical-chemistry-hub` | Atomic models, electrochemistry, gas laws |
| `/organic-name-reactions` | Named reaction reference |
| `/periodic-trends` | Periodic trends visualizer |
| `/interactive-periodic-table` | Interactive periodic table + trends |
| `/physics` | Physics simulators |

## Layout

```
features/simulations/
├── components/
│   ├── chemihex/          ← MoleculeNode, ReactionTable, ReagentCard, ReagentDeck, ReagentTray
│   └── organic-wizard/    ← ConversionGame, LevelSidebar, MoleculeViewer, ReagentCard, admin/
├── hooks/
│   ├── useChemiHexLogic.ts
│   └── useSaltQuizProgress.ts
├── lib/
│   ├── hammettCalculator.ts   ← Hammett substituent constants
│   └── chemAssets.ts          ← static chem-asset URL helpers
├── data/
│   ├── elementsData.ts         ← periodic table dataset
│   ├── inorganicTrendsData.ts
│   ├── kspData.ts
│   ├── organicReactionsData.ts
│   ├── saltAnalysisData.ts
│   ├── conversion_game_data.json
│   ├── reaction_table_data.json
│   └── reagents_data.json
├── index.ts
└── README.md
```

## Deferred to a future pass

Route-local simulator `.tsx` files still live inline at `app/<route>/` (e.g.
`app/organic-chemistry-hub/AcidityLab.tsx`, `app/physical-chemistry-hub/BohrModel.tsx`,
`app/salt-analysis/SaltAnalysisClient.tsx`). Moving them into
`features/simulations/components/<route>/` is a follow-up. Phase 4.9 prioritized
the cross-route shared bits where the feature-folder pattern adds clearest value.
