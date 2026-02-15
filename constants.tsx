
import React from 'react';
import { DeviceBrand, RepairIssue } from './types';

export const BRANDS: DeviceBrand[] = [
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' },
  { id: 'motorola', name: 'Motorola' },
  { id: 'huawei', name: 'Huawei' },
  { id: 'other', name: 'Otro' },
];

export const COMMON_ISSUES: RepairIssue[] = [
  { 
    id: 'screen', 
    label: 'Cambio de Pantalla', 
    description: 'Rotura de cristal, manchas o falla de táctil.', 
    basePrice: 80 
  },
  { 
    id: 'complex', 
    label: 'Otras Reparaciones', 
    description: 'Placa, batería, carga, cámaras o fallas complejas.', 
    basePrice: 0 
  },
];
