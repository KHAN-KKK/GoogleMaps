export interface MarinaBerth {
    MarinaId: string;
    Code: string;
    BerthType: string;
    Berth: string;
    BerthLength: string;
    Latitude: number ;
    Longitude: number ;
    RotationAngle: number;
    IsOccupied: boolean;
    Id: string;  //berth id
    IsActive: boolean;
    IsBooked : boolean;
    ContractType : string;
    ContractStartDate : string;
    ContractEndDate : string;
}