import { Siswa } from "@/types"
import { supabase } from "@/utils/supabase/client"
import { PostgrestSingleResponse } from "@supabase/supabase-js"

export const getDataSiswaClient = async () =>{
    const siswa : PostgrestSingleResponse<Siswa[]> = await supabase.from("siswa").select("*")
    return siswa
}

export const getBulanName = (kode: string): string => {
    const bulanMap: { [key: string]: string } = {
      "01": "Januari",
      "02": "Februari",
      "03": "Maret",
      "04": "April",
      "05": "Mei",
      "06": "Juni",
      "07": "Juli",
      "08": "Agustus",
      "09": "September",
      "10": "Oktober",
      "11": "November",
      "12": "Desember"
    };
    return bulanMap[kode] || "Invalid code";
  };
