# ✨ Quriosity - Conversation Card Games

Sebuah web app permainan kartu percakapan modern bertajuk **Quriosity**, dibangun untuk mencairkan suasana (*icebreaker*), membangun keintiman, atau seru-seruan saat berkumpul dengan fokus pada performa cepat, estetika minimalis, gestur kartu 3D yang mulus, dan audio prosedural tanpa ketergantungan library luar (*zero dependencies*).

---

## ✨ Fitur Utama

1. **Gestur Kartu 3D & Fisika Alami:**
   - Geser kanan (*Swipe Right*) untuk menjawab & lanjut ke kartu berikutnya.
   - Geser kiri (*Swipe Left*) untuk melewati (*skip*) pertanyaan.
   - Ketuk kartu (*Tap/Click*) atau tombol balik untuk melihat sisi belakang (refleksi & kiat percakapan).
   - Efek tumpukan kartu (*card stack*) dengan bayangan kedalaman realistis.

2. **12 Kategori Deck Beragam & Bilingual (Bahasa Indonesia & English):**
   - 💖 **Pasangan / Couples:** Keintiman emosional, percikan asmara, dan keterbukaan.
   - 🌌 **Obrolan Mendalam / Deep Convos:** Refleksi eksistensial, nilai hidup, dan perspektif filosofis.
   - 🧊 **Pencair Suasana / Ice Breaker:** Santai, menyenangkan, dan memecah kecanggungan.
   - 🎉 **Pesta & Pregame / Party:** Energi tinggi, cerita liar, dan pembakar suasana.
   - 🍷 **Jujur atau Minum / Truth or Drink:** Tantangan buka-bukaan atau teguk minuman.
   - 🔀 **Pilih Mana? / Would You Rather:** Dilema seru dan perdebatan moral.
   - ⚡ **Kursi Panas / Hot Seat:** Pertanyaan cepat dan tajam untuk satu orang di tengah lingkaran.
   - 🌙 **Pikiran Larut Malam / Late Night:** Kerentanan obrolan jam 3 pagi dan nostalgia.
   - 🌶️ **Spicy & Intim (18+):** Rahasia ranjang, fantasi berani & percikan gairah pasangan.
   - 🧐 **Do You Know Me? / Seberapa Kenal Kamu:** Uji seberapa dalam pasangan/teman tahu kebiasaanmu!
   - 🌒 **After Dark / Selepas Gelap:** Pengakuan tengah malam, rahasia terlarang & topik tabu.
   - ⚖️ **Me or You? / Aku atau Kamu?:** Saling tunjuk siapa yang paling sering atau paling mungkin!

3. **Mode Permainan Berbeda Warna & Pelacak Giliran:**
   - 🎯 **Klasik 21 Pertanyaan (Royal Electric Violet):** Sesi intim 21 kartu dengan progress bar menyala.
   - ♾️ **Mode Tanpa Batas (Neon Emerald & Cyan Pulse):** Kocok seluruh tumpukan kartu tanpa batas pertanyaan secara berulang (*infinite loop*).
   - 👥 **Pelacak Giliran (Pass & Play):** Menandai giliran (*Pemain 1*, *Pemain 2*, dst.) secara otomatis di setiap kartu.

4. **Audio & Haptic Tanpa Asset Eksternal:**
   - Dibuat menggunakan **Web Audio API** prosedural (suara geser kartu/whoosh, kocok deck, tap lembut, dan melodi penyelesaian).
   - Mendukung **Vibration API** untuk respon haptik nyata pada smartphone.

5. **Kustomisasi & Favorit:**
   - **Buat Deck Kustom:** Tambahkan pertanyaan pribadi Anda sendiri langsung dari browser.
   - **Simpan ke Favorit:** Simpan pertanyaan berkesan untuk dibuka kembali kapan saja.

---

## 🚀 Cara Menjalankan

Web app saat ini aktif di:
```bash
http://localhost:3000/
```
Buka tautan di atas di browser Anda (Chrome, Safari, Firefox, atau Edge).

Untuk memulai ulang server secara manual:
```bash
npm start
# atau
node server.js
```
