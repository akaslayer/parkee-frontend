import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import { useForm } from "react-hook-form";
import { Label, Layer, Rect, Stage, Text } from "react-konva";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Ticket } from "../../lib/Ticket";
import { Camera } from "lucide-react";

type VehicleType = "MOBIL" | "MOTOR" | "TRUK" | "";

interface TicketPreviewProps {
  date: Date;
  time: string;
  platNumber: string;
  vehicleType: VehicleType;
  nomorTiket: string;
}

const formSchema = z.object({
  nomorPlat: z.string().min(1, "Plat nomor harus diisi"),
  jenisKendaraan: z.enum(["MOBIL", "MOTOR", "TRUK"], {
    errorMap: () => ({ message: "Pilih jenis kendaraan" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const TicketPreview: React.FC<TicketPreviewProps> = ({
  date,
  time,
  platNumber,
  vehicleType,
  nomorTiket,
}) => {
  return (
    <Stage width={300} height={250}>
      <Layer>
        <Rect x={0} y={0} width={300} height={250} fill="white" />
        <Rect
          x={10}
          y={10}
          width={280}
          height={230}
          stroke="black"
          strokeWidth={2}
        />
        <Text
          x={0}
          y={20}
          width={300}
          text="TIKET PARKIR"
          align="center"
          fontSize={24}
          fontStyle="bold"
        />
        <Text x={30} y={60} text="Nomor Tiket" fontSize={16} />
        <Text x={30} y={90} text="Tanggal" fontSize={16} />
        <Text x={30} y={120} text="Jam Masuk" fontSize={16} />
        <Text x={30} y={150} text="Plat Nomor" fontSize={16} />
        <Text x={30} y={180} text="Jenis" fontSize={16} />
        <Text x={120} y={60} text=":" fontSize={16} />
        <Text x={120} y={90} text=":" fontSize={16} />
        <Text x={120} y={120} text=":" fontSize={16} />
        <Text x={120} y={150} text=":" fontSize={16} />
        <Text x={120} y={180} text=":" fontSize={16} />
        <Text x={140} y={60} text={nomorTiket || "_ _ _ _"} fontSize={16} />
        <Text
          x={140}
          y={90}
          text={format(date, "dd MMMM yyyy", { locale: id })}
          fontSize={16}
        />
        <Text x={140} y={120} text={time} fontSize={16} />
        <Text
          x={140}
          y={150}
          text={platNumber.toUpperCase() || "_ _ _ _"}
          fontSize={16}
        />
        <Text x={140} y={180} text={vehicleType || "_ _ _ _"} fontSize={16} />
        <Text
          x={0}
          y={220}
          width={300}
          text="Simpan tiket ini dengan baik"
          align="center"
          fontSize={12}
        />
      </Layer>
    </Stage>
  );
};

const CheckIn = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [ticketData, setTicketData] = useState<Ticket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomorPlat: "",
      jenisKendaraan: undefined,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const downloadTicket = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:8080/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomorPlat: data.nomorPlat.toUpperCase(),
          jenisKendaraan: data.jenisKendaraan.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const result = await response.json();
      setTicketData(result.data);

      setTimeout(() => {
        const stage = document.querySelector("canvas");
        if (!stage) {
          throw new Error("Canvas not found");
        }

        const dataUrl = stage.toDataURL();
        const link = document.createElement("a");
        link.download = `ticket-${data.nomorPlat}.jpg`;
        link.href = dataUrl;
        link.click();

        toast({
          title: "Sukses",
          description: "Tiket berhasil dicetak",
          className: "bg-green-500 text-white",
        });
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencetak tiket. tiket sebelumnya belum dibayar.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-5 lg:p-20 gap-5 flex flex-col">
      <h1 className="text-2xl font-bold">Check-In Parkir</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <form
          className="bg-white rounded-md p-5 flex flex-col gap-4 shadow-md lg:max-w-2xl w-full"
          onSubmit={form.handleSubmit(downloadTicket)}
        >
          <div className="flex-col gap-1">
            <h2 className="text-center font-bold text-xl">Pintu Masuk</h2>
            <div className="flex gap-2 text-center justify-center font-bold">
              <p>{format(currentDate, "dd MMMM yyyy", { locale: id })}</p>
              <h2>{formatTime(time)}</h2>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-semibold">
            <Label htmlFor="nomorPlat">Plat Nomor Kendaraan</Label>
            <Input
              type="text"
              id="nomorPlat"
              placeholder="Nomor Plat Kendaraan"
              {...form.register("nomorPlat")}
            />
            {form.formState.errors.nomorPlat && (
              <p className="text-sm text-red-500">
                {form.formState.errors.nomorPlat.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <Label htmlFor="jenisKendaraan">Jenis Kendaraan</Label>
            <Select
              onValueChange={(value: VehicleType) => {
                form.setValue(
                  "jenisKendaraan",
                  value as "MOBIL" | "MOTOR" | "TRUK"
                );
                form.trigger("jenisKendaraan"); // Manually trigger validation for this field
              }}
              value={form.watch("jenisKendaraan")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jenis Kendaraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOBIL">Mobil</SelectItem>
                <SelectItem value="MOTOR">Motor</SelectItem>
                <SelectItem value="TRUK">Truk</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.jenisKendaraan && (
              <p className="text-sm text-red-500">
                {form.formState.errors.jenisKendaraan.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-center">
            <Button
              type="submit"
              disabled={
                !form.formState.isValid || isSubmitting || ticketData !== null
              }
            >
              {isSubmitting ? "Mencetak..." : "Cetak Tiket"}
            </Button>
            <p className="font-normal text-gray-400">
              {ticketData
                ? "Refresh halaman untuk mencetak tiket baru!"
                : "Isi form untuk mencetak tiket"}
            </p>
          </div>
        </form>

        <div className="bg-white rounded-md p-5 shadow-md">
          <h2 className="text-center font-bold text-xl mb-4">Preview Tiket</h2>
          <div className="border border-gray-200 rounded-md flex justify-center min-w-60 min-h-60 items-center m-auto bg-gray-100 ">
            {ticketData ? (
              <TicketPreview
                date={new Date(ticketData.tanggalMasuk)}
                time={format(new Date(ticketData.tanggalMasuk), "HH:mm:ss")}
                platNumber={ticketData.nomorPlat}
                vehicleType={ticketData.jenisKendaraan as VehicleType}
                nomorTiket={ticketData.nomorParkingSlip}
              />
            ) :
            <Camera className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
