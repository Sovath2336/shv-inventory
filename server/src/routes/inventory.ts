import express from 'express';
import { body, validationResult } from 'express-validator';
import { Inventory } from '../models/Inventory';
import { auth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as XLSX from 'xlsx';

const router = express.Router();

// Get all inventory items
router.get('/', auth, async (req, res, next) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Add new inventory item
router.post(
  '/',
  auth,
  [
    body('itemName').trim().notEmpty(),
    body('partNumber').trim().notEmpty(),
    body('category').isIn(['RPM', 'Utility Panel', 'Handheld', 'Other']),
    body('workingGroup').isIn(['Smart Click', 'F.E.']),
    body('quantity').isInt({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { itemName, partNumber, category, workingGroup, quantity } = req.body;

      // Check if part number already exists
      const existingItem = await Inventory.findOne({ partNumber });
      if (existingItem) {
        throw new AppError('Part number already exists', 400);
      }

      const item = new Inventory({
        itemName,
        partNumber,
        category,
        workingGroup,
        quantity,
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

// Update inventory item
router.patch(
  '/:id',
  auth,
  [
    body('itemName').optional().trim().notEmpty(),
    body('category').optional().isIn(['RPM', 'Utility Panel', 'Handheld', 'Other']),
    body('workingGroup').optional().isIn(['Smart Click', 'F.E.']),
    body('quantity').optional().isInt({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const item = await Inventory.findById(req.params.id);
      if (!item) {
        throw new AppError('Item not found', 404);
      }

      const updates = req.body;
      Object.keys(updates).forEach((key) => {
        if (key !== 'partNumber' && key !== 'barcode') {
          item[key] = updates[key];
        }
      });

      await item.save();
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

// Checkout items
router.post(
  '/checkout',
  auth,
  [
    body('items').isArray(),
    body('items.*.id').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items } = req.body;
      const results = [];

      for (const checkoutItem of items) {
        const item = await Inventory.findById(checkoutItem.id);
        if (!item) {
          throw new AppError(`Item ${checkoutItem.id} not found`, 404);
        }

        if (item.quantity < checkoutItem.quantity) {
          throw new AppError(
            `Insufficient quantity for item ${item.itemName}`,
            400
          );
        }

        item.quantity -= checkoutItem.quantity;
        await item.save();

        results.push({
          item: item.itemName,
          quantity: checkoutItem.quantity,
          remaining: item.quantity,
        });
      }

      res.json({
        message: 'Checkout successful',
        results,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Export inventory to Excel
router.get('/export', auth, async (req, res, next) => {
  try {
    const items = await Inventory.find();
    
    // Prepare data for Excel
    const data = items.map(item => ({
      'Item Name': item.itemName,
      'Part Number': item.partNumber,
      'Category': item.category,
      'Working Group': item.workingGroup,
      'Quantity': item.quantity,
      'Barcode': item.barcode,
      'Last Updated': item.lastUpdated.toLocaleDateString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.xlsx');

    // Send file
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router; 