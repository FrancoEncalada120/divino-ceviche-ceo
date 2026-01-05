export interface Location {
  location_id: number;
  location_name: string;
  location_AccountNumber: string | null;
}

export type LocationUpsert = {
  location_name: string;
  location_AccountNumber: string | null;
};
