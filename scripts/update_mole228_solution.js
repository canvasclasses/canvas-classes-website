const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://REDACTED_USER:REDACTED_PASSWORD@crucible-cluster.x9hcudc.mongodb.net/crucible?retryWrites=true&w=majority&appName=Crucible-Cluster';
const client = new MongoClient(uri);

async function updateMOLE228() {
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('crucible');
    const collection = db.collection('questions_v2');
    
    const updatedSolution = "**Step 1: Balance the equation**\n$$2\\ce{KMnO4} + 5\\ce{H2O2} + 3\\ce{H2SO4} \\to 2\\ce{MnSO4} + 5\\ce{O2} + \\ce{K2SO4} + 8\\ce{H2O}$$\n\n**Step 2: Calculate moles of $\\ce{KMnO4}$**\nMolar mass of $\\ce{KMnO4} = 39 + 55 + 4(16) = 158\\,\\text{g mol}^{-1}$\n$$\\text{Moles of }\\ce{KMnO4} = \\frac{0.316}{158} = 0.002\\,\\text{mol}$$\n\n**Step 3: Use stoichiometry**\nFrom balanced equation: $2$ moles $\\ce{KMnO4}$ react with $5$ moles $\\ce{H2O2}$\n$$\\text{Moles of }\\ce{H2O2} = \\frac{5}{2} \\times 0.002 = 0.005\\,\\text{mol}$$\n\n**Step 4: Calculate mass of pure $\\ce{H2O2}$**\nMolar mass of $\\ce{H2O2} = 2(1) + 2(16) = 34\\,\\text{g mol}^{-1}$\n$$\\text{Mass of pure }\\ce{H2O2} = 0.005 \\times 34 = 0.17\\,\\text{g}$$\n\n**Step 5: Calculate purity**\n$$\\text{Purity} = \\frac{\\text{pure mass}}{\\text{total mass}} \\times 100 = \\frac{0.17}{0.2} \\times 100 = 85\\%$$\n\n**Key Points to Remember:**\n- Balance redox equations properly\n- Use stoichiometric ratios: $2\\ce{KMnO4} : 5\\ce{H2O2}$\n- Formula: $\\text{Purity} = \\frac{\\text{pure mass}}{\\text{total mass}} \\times 100$\n- $\\ce{KMnO4}$ molar mass $= 158\\,\\text{g mol}^{-1}$";
    
    const result = await collection.updateOne(
      { display_id: 'MOLE-228' },
      { 
        $set: { 
          'solution.text_markdown': updatedSolution,
          updated_at: new Date()
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated MOLE-228 solution');
      console.log('   Fixed: Mixed text+equation format to full equation format');
    } else {
      console.log('⚠️  No changes made (question may not exist or already updated)');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateMOLE228();
