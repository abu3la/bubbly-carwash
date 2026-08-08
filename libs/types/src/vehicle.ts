export type VehicleSize = 'sedan' | 'suv' | 'pickup' | 'motorcycle';

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  size: VehicleSize;
}
