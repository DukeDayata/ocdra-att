import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Personnel from '../models/Personnel.js';
import Approver from '../models/Approver.js';

dotenv.config();

const samplePersonnel = [
  {
    employeeId: '1',
    name: 'DESIDERIO R. APAG III',
    position: 'COMMISSIONER',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '2',
    name: 'ATTY. LISHA A. VILLACANAS',
    position: 'Executive Assistant IV',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '3',
    name: 'MARVIN HARROULD A. KHO',
    position: 'Executive Assistant III',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '4',
    name: 'ALBERT R. TRINIDAD',
    position: 'Executive Assistant II',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '5',
    name: 'CZHARLYZ NICOLE D. MANALANG',
    position: 'Senior Admin Assistant III',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '6',
    name: 'REGINE MAE H. GONZALES',
    position: 'Administrative Assistant VI',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '7',
    name: 'MARC ANTHONY C. ESPIRITU',
    position: 'Project Technical Staff III',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '8',
    name: 'IAN CHRISTOPHER N. MANGUBAT',
    position: 'Project Technical Staff II',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '9',
    name: 'VON FRANCIS A. LA VICTORIA',
    position: 'Project Technical Staff II',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '10',
    name: 'DUKE VINCENT PAUL DAYATA',
    position: 'Project Technical Staff II',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '11',
    name: 'CLIFFORD JAY M. JIMENEZ',
    position: 'Project Technical Staff II',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '12',
    name: 'RICHARD T. MANUEL',
    position: 'Admin Aide IV',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: ''
  },
  {
    employeeId: '13',
    name: 'SHIRLEY C. AGRUPIS, Ph.D',
    position: 'Chairperson',
    office: 'Commission on Higher Education',
    region: 'NCR',
    email: 'sagrupis@ched.gov.ph'
  }
];

const sampleApprovers = [
  {
    name: 'SHIRLEY C. AGRUPIS, Ph.D',
    position: 'Chairperson'
  },
  {
    name: 'SHIRLEY C. AGRUPIS, Ph.D',
    position: 'OIC - Chairperson'
  },
  {
    name: 'DESIDERIO R. APAG  III, D.Eng, PCpE',
    position: 'Commissioner'
  },
  {
    name: 'RICMAR P. AQUINO, Ph.D',
    position: 'Commissioner'
  },
  {
    name: 'MYRNA Q. MALLARI, DBA CPA',
    position: 'Commissioner'
  },
  {
    name: 'MICHELLE A. ONG, DPA',
    position: 'Commissioner'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing Personnel and Approvers...');
    await Personnel.deleteMany({});
    await Approver.deleteMany({});

    console.log('[Seed] Inserting sample Personnel...');
    await Personnel.insertMany(samplePersonnel);

    console.log('[Seed] Inserting sample Approvers...');
    await Approver.insertMany(sampleApprovers);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
