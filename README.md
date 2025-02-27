# Overthinkistan Next.js Projesi

Bu proje, Next.js ve Tailwind CSS kullanılarak oluşturulmuş bir web uygulamasıdır.

## Özellikler

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- ESLint
- Responsive tasarım
- Özel bileşenler

## Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Üretim için uygulamayı derler
- `npm start` - Derlenmiş uygulamayı başlatır
- `npm run lint` - ESLint ile kod kontrolü yapar

## Proje Yapısı

```
/
├── public/           # Statik dosyalar
├── src/              # Kaynak kodları
│   ├── app/          # App Router sayfaları
│   ├── components/   # Yeniden kullanılabilir bileşenler
│   └── styles/       # CSS dosyaları
├── .eslintrc.json    # ESLint yapılandırması
├── next.config.js    # Next.js yapılandırması
├── package.json      # Proje bağımlılıkları
├── postcss.config.js # PostCSS yapılandırması
├── tailwind.config.js # Tailwind CSS yapılandırması
└── tsconfig.json     # TypeScript yapılandırması
```

## Lisans

MIT
