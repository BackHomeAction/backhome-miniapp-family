export interface IPlaceInfo {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  tel?: string;
  title: string;
  type: "policeStation" | "lostPlace" | "offenPlace";
}
