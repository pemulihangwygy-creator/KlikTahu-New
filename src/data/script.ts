export type Line = { id: string; file: string; text: string };

/** One continuous VO performance — the same clips feed both the Short and the Long. */
export const SCRIPT: Line[] = [
  { id: 'v01', file: 'vo/v01.mp3', text: 'Coba ingat harga seporsi nasi ayam lima tahun lalu. Sekarang? Jauh lebih mahal, kan?' },
  { id: 'v02', file: 'vo/v02.mp3', text: 'Tapi gaji kita terasa jalan di tempat. Kamu nggak salah. Uangmu memang sedang menyusut.' },
  { id: 'v03', file: 'vo/v03.mp3', text: 'Dan biang keladinya punya nama yang jarang kita sadari: inflasi.' },
  { id: 'v04', file: 'vo/v04.mp3', text: 'Inflasi itu bukan angka abstrak di layar berita. Dia adalah selisih antara isi dompetmu dan harga di rak toko.' },
  { id: 'v05', file: 'vo/v05.mp3', text: 'Setiap bulan, Badan Pusat Statistik mendatangi ribuan pedagang di ratusan kota.' },
  { id: 'v06', file: 'vo/v06.mp3', text: 'Mereka mencatat harga dari satu keranjang yang sama: beras, cabai, bensin, sewa rumah, sampai pulsa.' },
  { id: 'v07', file: 'vo/v07.mp3', text: 'Keranjang itu berisi ratusan barang dan jasa yang paling sering dibeli rumah tangga Indonesia.' },
  { id: 'v08', file: 'vo/v08.mp3', text: 'Setiap barang punya bobot. Makanan dan minuman bobotnya paling besar, karena itu yang paling sering kita beli.' },
  { id: 'v09', file: 'vo/v09.mp3', text: 'Total belanja keranjang itu dijadikan satu angka. Namanya Indeks Harga Konsumen.' },
  { id: 'v10', file: 'vo/v10.mp3', text: 'Kalau bulan ini keranjangmu lebih mahal satu persen dari bulan lalu, berarti inflasi bulanan satu persen.' },
  { id: 'v11', file: 'vo/v11.mp3', text: 'Tapi cerita sesungguhnya baru terasa kalau kita membandingkannya setahun ke setahun.' },
  { id: 'v12', file: 'vo/v12.mp3', text: 'Inilah inflasi tahunan. Angka yang dipakai pemerintah untuk mengukur seberapa cepat harga-harga naik.' },
  { id: 'v13', file: 'vo/v13.mp3', text: 'Dan grafik ini menyimpan salah satu luka terbesar dalam sejarah ekonomi Indonesia.' },
  { id: 'v14', file: 'vo/v14.mp3', text: 'Tahun sembilan puluh delapan. Krisis moneter. Rupiah jatuh, harga meledak.' },
  { id: 'v15', file: 'vo/v15.mp3', text: 'Inflasi tahun itu menembus tujuh puluh tujuh koma enam tiga persen. Bukan salah ketik.' },
  { id: 'v16', file: 'vo/v16.mp3', text: 'Artinya, harga-harga secara rata-rata hampir dua kali lipat hanya dalam dua belas bulan.' },
  { id: 'v17', file: 'vo/v17.mp3', text: 'Seorang ibu yang menyimpan uang dapur lima ratus ribu, tahun berikutnya hanya bisa membeli sekitar separuh barang yang sama.' },
  { id: 'v18', file: 'vo/v18.mp3', text: 'Tapi bandingkan dengan dua ribu dua puluh empat. Inflasi turun ke satu koma lima tujuh persen, terendah sejak tahun lima puluhan.' },
  { id: 'v19', file: 'vo/v19.mp3', text: 'Dan dua ribu dua puluh lima ditutup di dua koma sembilan dua persen.' },
  { id: 'v20', file: 'vo/v20.mp3', text: 'Jadi, kalau inflasinya kecil, apakah hidup kita otomatis lebih mudah? Belum tentu.' },
];

export const LINE = Object.fromEntries(SCRIPT.map((l) => [l.id, l]));
