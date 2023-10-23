export interface coordinates {
    latitude: number;
    longitude: number
}

export interface SurveyList {
    shopImage: string;
    shopName: string;
    ownerName: string;
    cordinates: coordinates[];
}