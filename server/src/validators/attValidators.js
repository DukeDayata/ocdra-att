import { z } from 'zod';

export const createATTSchema = z.object({
  attType: z.enum(['Local', 'Abroad']),
  personnel: z
    .array(
      z.object({
        personnelId: z.string().optional(),
        name: z.string().min(1, 'Personnel name is required'),
        position: z.string().min(1, 'Personnel position is required'),
        office: z.string().optional()
      })
    )
    .min(1, 'At least one personnel must be selected'),
  destination: z.string().min(1, 'Destination is required'),
  travelStartDate: z.string().optional().nullable(),
  travelEndDate: z.string().optional().nullable(),
  periodOfTravel: z.string().min(1, 'Period of travel is required'),
  officeStation: z.string().default('Commission on Higher Education - Central Office'),
  purpose: z.string().min(1, 'Purpose of travel is required'),
  travelClassification: z.enum(['Official Business', 'Official Time Only', 'Personal Time']),
  datePrepared: z.string().optional(),
  requestedBy: z
    .object({
      personnelId: z.string().optional(),
      name: z.string().optional(),
      position: z.string().optional()
    })
    .optional(),
  fundsAvailable: z.string().default('Diana C. Aguilar'),
  fundsAvailablePosition: z.string().optional(),
  sourceOfFunds: z.string().default('Personal'),
  expenses: z
    .object({
      airfare: z.number().or(z.string()).optional(),
      perDiem: z.number().or(z.string()).optional(),
      preTravel: z.number().or(z.string()).optional(),
      totalAmount: z.number().or(z.string()).optional(),
      airfareRaw: z.string().optional(),
      perDiemRaw: z.string().optional(),
      preTravelRaw: z.string().optional(),
      totalAmountRaw: z.string().optional(),
      expenseType: z.string().optional()
    })
    .optional(),
  paymentMode: z.enum(['None', 'Cash Advance', 'Reimbursement', '']).default(''),
  approvedBy: z
    .object({
      approverId: z.string().optional(),
      name: z.string().optional(),
      position: z.string().optional()
    })
    .optional(),
  submittedBy: z.string().optional()
});

export const updateATTStatusSchema = z.object({
  status: z.enum([
    'Draft',
    'Generated',
    'Submitted',
    'For Signature',
    'Signed',
    'Return',
    'Disapproved',
    'Cancelled',
    'Archived'
  ]),
  remarks: z.string().optional(),
  changedBy: z.string().optional()
});
