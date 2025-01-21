export interface Ticket {
    id:number;
    jenisKendaraan:string;
    nomorPlat:string;
    tanggalMasuk:string;
    nomorParkingSlip:string;
}


export interface TicketCheckoutData{
    id:number;
    jenisKendaraan:string;
    nomorPlat:string;
    nomorParkingSlip:string;
    tanggalMasuk:string
    tanggalKeluar:string;
    totalHarga:number;
    totalWaktu:string
}