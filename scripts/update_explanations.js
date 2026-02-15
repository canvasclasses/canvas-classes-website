const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/conversion_game_data.json');
const rawData = fs.readFileSync(filePath);
const levels = JSON.parse(rawData);

const explanations = {
    "ncert_10_19_01": "Hydroboration-Oxidation is an Anti-Markovnikov addition of water. It converts Propene to Propan-1-ol by adding OH to the less substituted carbon.",
    "ncert_10_19_02": "First, convert Ethanol to Chloroethane using SOCl2. Then, treat with Sodium Acetylide (HC≡C-Na+) to perform nucleophilic substitution, extending the chain to But-1-yne.",
    "ncert_10_19_03": "Eliminate HBr from 1-Bromopropane using alcoholic KOH to form Propene. Then, add HBr (without peroxide) to follow Markovnikov's rule, placing Br at the more substituted position.",
    "ncert_10_19_04": "Free radical chlorination (Cl2/hv) targets the benzylic position of Toluene. Subsequent hydrolysis with aqueous KOH replaces the Cl with OH, yielding Benzyl Alcohol.",
    "ncert_10_19_05": "Bromination comes first because -Br directs Ortho/Para. If we nitrated first, -NO2 would direct Meta. Nitration of Bromobenzene yields the Para isomer as the major product.",
    "ncert_10_19_06": "Convert Alcohol to Chloride (PCl5). Use KCN to add a carbon (Nitrile). Complete acid hydrolysis of the Nitrile converts -CN to -COOH.",
    "ncert_10_19_07": "Convert Ethanol to Ethyl Chloride (SOCl2). Then use KCN (alcoholic) for nucleophilic substitution to form Propanenitrile, extending the carbon chain.",
    "ncert_10_19_08": "Aniline is diazotized with NaNO2/HCl at 0-5°C to form Benzene Diazonium Chloride. CuCl/HCl (Sandmeyer) then replaces the diazonium group with Chlorine.",
    "ncert_10_19_09": "Treating 2-Chlorobutane with Sodium in dry ether couples two alkyl groups together (Wurtz Reaction), doubling the structure to form 3,4-Dimethylhexane.",
    "ncert_10_19_10": "Addition of HCl to the alkene follows Markovnikov's rule. The H+ adds to the carbon with more hydrogens, placing the Cl- on the tertiary carbocation.",
    "ncert_10_19_11": "React Ethyl Chloride with KCN to form Propanenitrile (adding a carbon). Acidic hydrolysis (H3O+) converts the nitrile group (-CN) directly to a carboxylic acid (-COOH).",
    "ncert_10_19_12": "Add HBr with Peroxide (Anti-Markovnikov) to get 1-Bromobutane. Then use NaI in Acetone (Finkelstein Reaction) to exchange Bromine for Iodine via SN2 mechanism.",
    "ncert_10_19_13": "Dehydrohalogenation (Alc KOH) forms Propene. Hydroboration-Oxidation then adds water Anti-Markovnikov to give 1-Propanol, effective moving the functional group to the end.",
    "ncert_10_19_14": "Iodine and NaOH oxidize the methyl ketone/alcohol to a carboxylate and produce yellow Iodoform (CHI3) precipitate. This is a specific test for methyl carbinols/ketones.",
    "ncert_10_19_15": "Nitrate Chlorobenzene to introduce -NO2 at Para position. The electron-withdrawing nitro group activates the ring for Nucleophilic Aromatic Substitution (Dow Process) to replace Cl with OH.",
    "ncert_10_19_16": "Eliminate HBr to form Propene. Then apply Kharasch Effect (HBr + Peroxide) for Anti-Markovnikov addition, moving Bromine to the primary carbon.",
    "ncert_10_19_17": "Wurtz Reaction: 2 molecules of Chloroethane react with Sodium in dry ether to form Butane, effectively doubling the carbon chain length.",
    "ncert_10_19_18": "First, brominate Benzene. Then, treat Iodobenzene/Bromobenzene with Sodium in dry ether (Fittig Reaction) to couple two phenyl rings, forming Diphenyl (Biphenyl).",
    "ncert_10_19_19": "Elimination gives Isobutylene. Anti-Markovnikov addition (HBr/Peroxide) places Br on the primary carbon, converting tert-butyl to isobutyl bromide.",
    "ncert_10_19_20": "Heating a primary amine (Aniline) with Chloroform and alcoholic KOH yields a foul-smelling Isocyanide (Phenyl Isocyanide). This reaction is specific to primary amines.",
    "ncert_conv_2_01": "Brominate benzene first (-Br is o/p directing). Then nitrate. The Para isomer is major due to steric factors. (Nitrating first would give m-Bromonitrobenzene).",
    "ncert_conv_2_02": "Nitrate benzene first (-NO2 is Meta directing). Then chlorinate. The incoming Cl+ ion attacks the meta position relative to the nitro group.",
    "ncert_conv_2_03": "Friedel-Crafts Alkylation adds a Methyl group (o/p director). Nitration then occurs primarily at the Para position (less steric hindrance than ortho).",
    "ncert_conv_2_04": "Friedel-Crafts Acylation uses Acetyl Chloride (CH3COCl) and AlCl3 to substitute an H on the benzene ring with an Acyl group, forming Acetophenone.",
    "ncert_conv_2_05": "Pass Ethyne through a red-hot iron tube at 873K. Three ethyne molecules undergo cyclic polymerization to form the aromatic Benzene ring.",
    "ncert_conv_2_06": "Add Bromine to form 1,2-Dibromoethane. Double elimination (Alc KOH then NaNH2) removes 2 HBr molecules to form Ethyne. Then polymerize to Benzene.",
    "ncert_conv_2_07": "Catalytic reforming of n-Hexane over Mo2O3/V2O5 oxides at high temp/pressure causes dehydrogenation and cyclization to form Benzene.",
    "ncert_11_alc_01": "Acid-catalyzed hydration follows Markovnikov's rule. The carbocation intermediate forms on the secondary carbon, leading to Propan-2-ol.",
    "ncert_11_alc_02": "Benzyl Chloride undergoes hydrolysis with aqueous KOH. The primary benzylic carbocation is somewhat stable, or SN2 occurs, replacing Cl with OH.",
    "ncert_11_alc_03": "Grignard reagent attacks Methanal (Formaldehyde) to add one carbon and form a primary alkoxide. Acid workup yields the primary alcohol.",
    "ncert_11_alc_04": "Grignard reagent attacks Acetone (Ketone). The nucleophilic carbon adds to the carbonyl carbon, forming a tertiary alkoxide, then tertiary alcohol.",
    "ncert_11_alc_05": "Mechanism follows Markovnikov addition. H+ adds to the double bond to form the stable tertiary cyclic carbocation. Water attacks there to form 1-Methylcyclohexanol.",
    "ncert_11_alc_06": "Hydration of the alkene. The double bond is symmetrical in position but substituents direct formation of the stable tertiary carbocation/alcohol.",
    "ncert_11_alc_07": "Markovnikov addition to Pent-1-ene puts the positive charge on C2. Water attacks C2 to form Pentan-2-ol.",
    "ncert_11_alc_08": "H+ attacks the double bond to form a tertiary carbocation at the branching point. Water attacks to yield the tertiary alcohol.",
    "ncert_12_ald_01": "Friedel-Crafts Alkylation gives Toluene. KMnO4 oxidizes the methyl side chain to Benzoic Acid. Fischer Esterification with Methanol gives Methyl Benzoate.",
    "ncert_12_ald_02": "Alkylate to Toluene. Oxidize to Benzoic Acid (-COOH is Meta directing). Nitrate the Benzoic Acid to get the 'meta' nitro group.",
    "ncert_12_ald_03": "Alkylate to Toluene (-CH3 is O/P directing). Nitrate Toluene to get p-Nitrotoluene. Then oxidize the methyl group to -COOH using KMnO4.",
    "ncert_12_ald_04": "Reduce Ketone to Secondary Alcohol using NaBH4. Then dehydrate with conc. H2SO4 to form the alkene.",
    "ncert_12_ald_05": "Convert Acid to Acid Chloride with SOCl2. Then perform Rosenmund Reduction (H2/Pd-BaSO4) which selectively stops reduction at the Aldehyde stage.",
    "ncert_12_ald_06": "Oxidize Ethanol to Acetaldehyde (PCC). Dilute NaOH induces Aldol Condensation: alpha-hydrogen is removed, enolate attacks another aldehyde molecule.",
    "ncert_12_ald_07": "Phenyl Magnesium Bromide attacks Benzaldehyde to form Diphenylmethanol (2° alcohol). Oxidation with PCC yields Benzophenone.",
    "ncert_12_ald_08": "Nucleophilic addition of HCN (CN-) to the carbonyl group of Benzaldehyde forms a Cyanohydrin. Acid hydrolysis converts -CN to -COOH.",
    "ncert_12_ald_09": "Nitrate Benzoic Acid (Meta product). Diborane (B2H6) selectively reduces Carboxylic Acids to Alcohols, leaving the Nitro group intact.",
    "ncert_13_amin_01": "Convert Acid to Amide (NH3/heat). Hoffmann Bromamide Degradation (Br2/KOH) removes the carbonyl carbon, producing an amine with one less carbon.",
    "ncert_13_amin_02": "Partial hydrolysis of nitriles yields Amides. Hoffmann Bromamide Degradation then chops off the carbonyl carbon to give the step-down amine.",
    "ncert_13_amin_03": "Methanol -> Chloromethane -> Acetonitrile (add C) -> Hydrolysis to Ethanoic Acid.",
    "ncert_13_amin_04": "Amine -> Alcohol (HNO2). Alcohol -> Acid (KMnO4). Acid -> Amide. Amide -> Amine (Step Down via Hoffmann).",
    "ncert_13_amin_05": "Amine -> Alcohol. Alcohol -> Chloride. Chloride -> Nitrile (Step Up). Nitrile -> Amine (Reduction).",
    "ncert_13_amin_06": "Reduce Nitro to Amine (Sn/HCl). Convert to Isocyanide (Carbylamine). Reduce Isocyanide (LiAlH4) to Secondary Amine.",
    "ncert_13_amin_07": "Nitrate (Meta). Brominate (Meta to NO2). Reduce NO2 to NH2. Diazotize. Hydrolyze to OH."
};

const updatedLevels = levels.map(level => {
    if (explanations[level.id]) {
        level.explanation = explanations[level.id];
    } else {
        level.explanation = level.description; // Fallback
    }
    return level;
});

fs.writeFileSync(filePath, JSON.stringify(updatedLevels, null, 4));
console.log("Updated explanations for " + updatedLevels.length + " levels.");
