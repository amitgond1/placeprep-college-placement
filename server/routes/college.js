const express = require('express');
const router = express.Router();
const CollegePlacement = require('../models/CollegePlacement');
const { protect } = require('../middleware/auth');

// GET /api/college/placements
router.get('/placements', protect, async (req, res) => {
  try {
    const { college, year, minPackage, maxPackage } = req.query;
    const filter = {};
    if (college) filter.college = { $regex: college, $options: 'i' };
    if (year) filter.year = Number(year);
    if (minPackage || maxPackage) {
      filter.package = {};
      if (minPackage) filter.package.$gte = Number(minPackage);
      if (maxPackage) filter.package.$lte = Number(maxPackage);
    }

    const placements = await CollegePlacement.find(filter)
      .sort({ upvotes: -1, createdAt: -1 })
      .populate('submittedBy', 'name');

    res.json({ placements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/college/placements
router.post('/placements', protect, async (req, res) => {
  try {
    const { college, company, package: pkg, cgpaCutoff, rounds, testType, year, notes } = req.body;
    const placement = await CollegePlacement.create({
      college, company, package: pkg, cgpaCutoff, rounds,
      testType, year, notes, submittedBy: req.user._id
    });
    res.status(201).json({ placement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/college/placements/:id/upvote
router.post('/placements/:id/upvote', protect, async (req, res) => {
  try {
    const placement = await CollegePlacement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Not found' });

    const userId = req.user._id.toString();
    const alreadyUpvoted = placement.upvotedBy.map(id => id.toString()).includes(userId);
    if (alreadyUpvoted) {
      placement.upvotes -= 1;
      placement.upvotedBy = placement.upvotedBy.filter(id => id.toString() !== userId);
    } else {
      placement.upvotes += 1;
      placement.upvotedBy.push(req.user._id);
    }
    await placement.save();
    res.json({ upvotes: placement.upvotes, upvoted: !alreadyUpvoted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/college/stats/:college
router.get('/stats/:college', protect, async (req, res) => {
  try {
    const college = decodeURIComponent(req.params.college);
    const stats = await CollegePlacement.aggregate([
      { $match: { college: { $regex: college, $options: 'i' } } },
      {
        $group: {
          _id: '$year',
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' },
          companies: { $addToSet: '$company' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
