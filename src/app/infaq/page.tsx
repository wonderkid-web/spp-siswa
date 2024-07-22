"use client";
import { semester1, semester2 } from "@/static";
import { KodeBayar, Semester, Siswa } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import uuid from "react-uuid";

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [kode, setKode] = useState<KodeBayar | []>([]);
  const { status, data: session } = useSession();

  const handleTransaction = async (kodeBaru: Semester["kode"]) => {
    // @ts-ignore
    delete session?.user?.password;
    // @ts-ignore
    delete session?.user?.created_at;

    const tahun = new Date().getFullYear();

    const newTransaksi = {
      ...session?.user,
      kode: kodeBaru,
      tahun,
      id: uuid(),
    };

    await supabase.from("transaksi").insert([newTransaksi]);

    // @ts-ignore
    const { data: siswa } = await supabase.from("siswa").select("*").eq('nis', session?.user?.nis)

    if (siswa?.length) {
      const updateKode = [...siswa[0].kode, kodeBaru];

      // @ts-ignore
      await supabase
        .from("siswa")
        .update({ kode: updateKode })
        // @ts-ignore
        .eq("nis", session?.user?.nis)
        .select();

      getKode();
    }
  };

  const getKode = async () => {
    const { data }: PostgrestSingleResponse<Siswa[]> = await supabase
      .from("siswa")
      .select("*")
      // @ts-ignore
      .eq("nis", session?.user.nis);
    if (data?.length) {
      setKode(data[0].kode);
    }
  };

  useEffect(() => {
    getKode();
    if (selectedPeriod == 1) {
      setSemester(semester1);
    } else {
      setSemester(semester2);
    }
  }, [selectedPeriod]);

  if (status == "loading" && kode)
    return <h1 className="text-center mt-48 text-2xl">Loading...</h1>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sidebar Section - assuming it's imported or implemented */}
      {/* <div className="style/sidebar.php"></div> */}

      {/* Main Content */}
      <div className="main-content">
        <h2 className="text-2xl font-bold mb-4">DAFTAR PEMBAYARAN SPP</h2>

        {/* Select Periode Section */}
        <div className="select mb-4">
          <label htmlFor="periode" className="block mb-2">
            Pilih Periode Pembayaran:
          </label>
          <select
            name="periode"
            id="periode"
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(+e.target.value)}
          >
            <option value="">-- Pilih Periode --</option>
            <option value="1">Periode 1 (Januari - Juni)</option>
            <option value="2">Periode 2 (Juli - Desember)</option>
          </select>
        </div>

        {/* Payment List Section */}
        {selectedPeriod && (
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Uraian
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Pilih
                </th>
              </tr>
            </thead>
            <tbody>
              {semester.map((s) => (
                <tr key={s.bulan} className="bg-gray-100">
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {s.kode}
                  </td>
                  <td className="px-5 py-5 capitalize border-b border-gray-200 text-sm">
                    {s.bulan}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    Rp. 80.000
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {kode.includes(s.kode as never) ? (
                      <p className="px-2 py-1 rounded-md bg-green-500 font-bold text-white w-fit">
                        Lunas
                      </p>
                    ) : (
                      <button
                        onClick={() => handleTransaction(s.kode)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                      >
                        Pilih
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
