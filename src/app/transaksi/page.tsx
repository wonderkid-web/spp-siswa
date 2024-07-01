"use client";

import { getBulanName, showTanggal } from "@/helper/client";
import { Tahun, Transaksi } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import uuid from "react-uuid";

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState<Tahun | null>(null);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const { status, data: session } = useSession();

  //   const handleTransaction = async (kodeBaru: Semester["kode"]) => {
  //     const { data: siswa } = await supabase.from("siswa").select("kode");
  //     if (siswa?.length) {
  //       const updateKode = [...siswa[0].kode, kodeBaru];

  //       // @ts-ignore
  //       const { data, error } = await supabase
  //         .from("siswa")
  //         .update({ kode: updateKode })
  //         // @ts-ignore
  //         .eq("nis", session?.user?.nis)
  //         .select();

  //       getKode();
  //     }
  //   };

  const getTransaksi = async () => {
    const { data }: PostgrestSingleResponse<Transaksi[]> =
      // @ts-ignore

      await supabase.from("transaksi").select("*").eq("nis", session?.user.nis);

    if (data?.length) {
      setTransaksi(data);
    }
  };

  const getTransaksiByTahun = async () => {
    const { data }: PostgrestSingleResponse<Transaksi[]> = await supabase
      .from("transaksi")
      .select("*")
      // @ts-ignore
      .eq("nis", session?.user?.nis)
      .eq("tahun", selectedPeriod);

    if (data?.length) {
      setTransaksi(data);
    } else {
      setTransaksi([]);
    }
  };

  useEffect(() => {
    // getTransaksi();
    getTransaksiByTahun();
  }, [selectedPeriod]);

  if (status == "loading")
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
            value={selectedPeriod as string}
            onChange={(e: any) => setSelectedPeriod(e.target.value)}
          >
            <option value="">-- Pilih Periode --</option>
            <option value="2024">Tahun 2024</option>
            <option value="2025">Tahun 2025</option>
            <option value="2026">Tahun 2026</option>
          </select>
        </div>

        {/* Payment List Section */}
        {selectedPeriod && (
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Bulan
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-xs font-semibold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length ? (
                transaksi.map((t, i) => (
                  <tr key={uuid()} className="bg-gray-100">
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {i + 1}
                    </td>
                    <td className="text-center px-5 py-5 border-b border-gray-200 text-sm">
                      {+t.kode < 7 ? "1" : "2"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {getBulanName(t.kode)}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      Rp. 80.000
                    </td>
                    <td className="px-5 py-5 capitalize border-b text-center border-gray-200 text-sm">
                      {showTanggal(t.created_at)}
                    </td>
                    <td className="text-center px-5 py-5 capitalize border-b border-gray-200 text-sm">
                      {t.status ? "Lunas" : "Menunggu"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-gray-100">
                  <td
                    colSpan={6}
                    className="text-gray-600 text-2xl text-center *:first-letter: px-5 py-5 border-b border-gray-200"
                  >
                    Data Kosong
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
