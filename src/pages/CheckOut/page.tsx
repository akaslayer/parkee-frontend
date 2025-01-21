import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "react-konva";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "../../components/ui/button";
import useTickets from "../../hooks/useTicket";
import { TicketCheckoutData } from "../../lib/Ticket";
import { useToast } from "../../hooks/use-toast";

const CheckOut = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [time, setTime] = useState<Date>(new Date());
  const { fetchTicket, updateTicket } = useTickets();
  const [ticketData, setTicketData] = useState<TicketCheckoutData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetchTicket(formData);

        if (response?.data) {
          setTicketData(response.data);
          toast({
            title: "Tiket berhasil diambil",
            description: "Data tiket berhasil diambil.",
            className: "bg-green-500 text-white",
          });
        } else {
          toast({
            title: "Tiket tidak ditemukan",
            description: "Tidak ada tiket yang ditemukan untuk gambar ini.",
            variant: "destructive",
          });
          setTicketData(null);
        }
      } catch (error) {
        console.error("Error mengunggah gambar:", error);
        toast({
          title: "Error saat mengunggah tiket",
          description: "Terjadi kesalahan saat mengunggah tiket.",
          variant: "destructive",
        });
        setTicketData(null);
      } 
    } else {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file gambar untuk diunggah.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!ticketData) {
      toast({
        title: "Data tiket tidak tersedia",
        description: "Anda perlu mengunggah tiket terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const { nomorParkingSlip, totalHarga, tanggalKeluar } = ticketData;

    const payload = {
      nomorTiket: nomorParkingSlip,
      totalHarga: totalHarga,
      tanggalKeluar: tanggalKeluar,
      metodePembayaran: "CASH",
    };

    try {
      const response = await updateTicket(payload);

      if (response?.data) {
        toast({
          title: "Checkout berhasil",
          description: "Proses checkout berhasil dilakukan.",
          className: "bg-green-500 text-white",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast({
          title: "Checkout gagal",
          description: "Terjadi masalah saat memproses checkout.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Checkout gagal",
        description: "Terjadi kesalahan saat memproses checkout.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd MMMM yyyy", { locale: id });
  };

  return (
    <div className="py-10 px-5 lg:p-20 gap-5 flex flex-col">
      <h1 className="text-2xl font-bold">Check-Out Parkir</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-5">
        <div className="bg-white rounded-md p-3 md:p-5 flex flex-col gap-3 md:gap-4 shadow-md w-full h-fit">
          <h2 className="text-center font-bold text-lg md:text-xl">
            Preview Tiket
          </h2>
          <div className="flex justify-center items-center w-full">
            <div className="relative w-full aspect-square max-w-sm  bg-gray-100 rounded-lg flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Camera className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center mt-2">
            <div>
              <input
                type="file"
                id="upload-input"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="upload-input"
                className="inline-block font-bold px-2 py-1.5 md:py-2 text-xs md:text-sm rounded cursor-pointer text-white bg-black hover:bg-gray-500"
              >
                Upload Tiket
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 rounded-lg shadow-md justify-center bg-white h-fit md:h-96">
          <h2 className="text-lg font-bold text-center">Data Kendaraan</h2>
          <div className="flex flex-col gap-1 font-semibold">
            <Label htmlFor="plat-number">Plat Nomor Kendaraan</Label>
            <Input
              type="text"
              id="plat-number"
              disabled={true}
              value={ticketData ? ticketData.nomorPlat : ""}
            />
          </div>
          <div className="flex flex-col gap-1 font-semibold">
            <Label htmlFor="jenis-kendaraan">Jenis Kendaraan</Label>
            <Input
              type="text"
              id="jenis-kendaraan"
              disabled={true}
              value={ticketData ? ticketData.jenisKendaraan : ""}
            />
          </div>
          <div className="flex flex-col gap-1 font-semibold">
            <Label htmlFor="slip">Nomor Parking Slip</Label>
            <Input
              type="text"
              id="slip"
              disabled={true}
              value={ticketData ? ticketData.nomorParkingSlip : ""}
            />
          </div>
          <div className="flex flex-col gap-1 font-semibold">
            <Label htmlFor="payment">Metode Pembayaran</Label>
            <Input type="text" id="payment" value="CASH" disabled={true} />
          </div>
        </div>
        <div className="flex flex-col p-5 gap-4 rounded-md shadow-md md:col-span-2 min-h-96 bg-white">
          <div className="text-center mb-2">
            <h2 className="font-semibold text-gray-600">Cashy</h2>
            <div className="flex gap-2 text-center justify-center font-bold">
              <p>{format(currentDate, "dd MMM yyyy", { locale: id })}</p>
              <h2>{formatTime(time)}</h2>
            </div>
          </div>
          <div className="flex flex-col flex-grow h-80">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <p className="text-gray-500">Tanggal Masuk</p>
                <p className="font-bold">
                  {ticketData
                    ? formatDate(new Date(ticketData.tanggalMasuk))
                    : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Tanggal Keluar</p>
                <p className="font-bold">
                  {ticketData
                    ? formatDate(new Date(ticketData.tanggalKeluar))
                    : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Jam Masuk</p>
                <p className="font-bold">
                  {ticketData
                    ? formatTime(new Date(ticketData.tanggalMasuk))
                    : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Jam Keluar</p>
                <p className="font-bold">
                  {ticketData
                    ? formatTime(new Date(ticketData.tanggalKeluar))
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <p className="text-red-600 font-bold">Total Harga</p>
                <p className="text-red-600 font-bold">
                  Rp. {ticketData != null ? ticketData.totalHarga : "0"}
                </p>
              </div>
              <p className="text-center text-gray-500 text-sm mb-4">
                {ticketData != null
                  ? ticketData.totalWaktu
                  : "0 days 0 hours 0 minutes"}
              </p>
              <Button
                className="w-full bg-red-100 hover:bg-red-200 text-red-600"
                onClick={handlePayment}
              >
                Pay for Rp. {ticketData != null ? ticketData.totalHarga : "0"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
