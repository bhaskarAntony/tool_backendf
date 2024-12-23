const officer = require('../models/officer');
const Transaction = require('../models/transaction');
const Weapon = require('../models/weapon');

exports.issueWeapons = async (req, res) => {
    try {
        const { officerId, weaponIds } = req.body;

        // Update weapon status to "issued"
        const weapons = await Weapon.find({
            _id: { $in: weaponIds },
            $or: [
              // { fixedToOfficer: null },  // Field is null
                // {
                //     "fixedToOfficer.rank": "",
                //     "fixedToOfficer.metalno": "",
                //     "fixedToOfficer.officername": ""
                // },
                {
                    isIssued:false
                }
            ]
        });
        if (weapons.length !== weaponIds.length) {
            return res.status(400).json({ error: 'One or more weapons are already issued or fixed to another officer.' });
        }
        console.log(weapons);

        

        

        // var weaponsData = [];

        // for (let weapon of weapons) {
        //     // weapon.status = 'issued';
        //     // await weapon.save();
        //     console.log(weapon);
        //     weaponsData.push(weapon);
        // };
        // console.log('ww'+ weaponsData);
        const weaponsData = await Promise.all(
            weapons.map(async (weapon) => {
                weapon.status = 'issued';
                await weapon.save();
                return weapon; // Collect the updated weapon
            })
        );
        console.log(weaponsData);
        

        const officerdata = await officer.findById(officerId);
        if(!officerdata){
            return res.json({
                message:'Officer is not found'
            })
        }

        const transaction = new Transaction({
            officer: officerdata,
            weapons: weaponsData,
        });
        officerdata.status = 'recieved';
        await officerdata.save()
        await transaction.save();
        res.status(200).json({ message: 'Weapons issued successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.issueFixedWeapons = async (req, res) => {
    try {
        const { id } = req.params;
        // const { officerId } = req.body; // Ensure officerId is passed in the request body

        // Check if the weapon exists
        const weapon = await Weapon.findById(id);

        if (!weapon) {
            return res.status(404).json({ message: 'Weapon not found' });
        }

  

        // // Check if the weapon is already issued
        // if (weapon.status === 'issued') {
        //     return res.status(400).json({ message: 'Weapon is already issued' });
        // }

        // Update weapon status and assign it to an officer
      
        // weapon.fixedToOfficer = { ...req.body.fixedToOfficer }; // Assuming officer details are sent in the body
        

        // Log the transaction
        const transaction = new Transaction({
            weapons: weapon._id, // Save only the weapon ID for reference
        });

        weapon.status = 'issued';
        await weapon.save();

        await transaction.save();

        res.status(200).json({ message: 'Weapon issued successfully', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.takeFixedWeapons = async (req, res) => {
    try {
        const { id } = req.params; // Weapon ID
        const { used, purpose } = req.body;

        // Find the weapon by ID
        const weapon = await Weapon.findById(id);
        if (!weapon) {
            return res.status(404).json({ message: 'Weapon not found' });
        }

        // Find the transaction associated with this weapon
        const transaction = await Transaction.findOne({ weapons: id });
        console.log(transaction);
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found for this weapon' });
        }

        // Update the transaction with new data
        transaction.returnDate = Date.now();
        transaction.used = used;
        transaction.purpose = purpose;
        await transaction.save();

        // Update weapon status to 'In Service'
        weapon.status = 'Available';
        await weapon.save();

        res.status(200).json({ message: 'Weapon returned and transaction updated successfully', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Controller to return weapons
exports.returnWeapons = async (req, res) => {
    try {
        const { transactionId, weaponsIds } = req.body;

        // Find the transaction by ID
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check if all weapons are part of the transaction
        const invalidWeapons = weaponsIds.filter(id => !transaction.weapons.includes(id));
        console.log(invalidWeapons);
        
        if (!invalidWeapons.length > 0) {
            return res.status(400).json({ error: 'Invalid weapons for this transaction', invalidWeapons });
        }



      

            // Mark the transaction as returned by updating its returnDate
            transaction.returnDate = new Date();
            transaction.returned = true;

          // Update weapon statuses to "available" and reset fixedToOfficer to null
          const updatedWeapons = await Weapon.updateMany(
            { _id: { $in: weaponsIds } },
            { 
                $set: { status: 'available', fixedToOfficer: null },
                $push: { history: transactionId }
            }
        );
        const officerData = await officer.findById(transaction.officer._id);
        if(!officerData){
            return res.json({
                message:'Officer data not found'
            })
        }
        officerData.status = 'returned';
        await officerData.save();

        await transaction.save();

        // Respond with the updated weapon count
        res.status(200).json({
            message: 'Weapons returned successfully',
            updatedWeaponsCount: updatedWeapons.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

