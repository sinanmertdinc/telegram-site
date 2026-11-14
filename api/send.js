
export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            return res.status(500).json({
                success: false,
                error: "Sunucu ayarları eksik."
            });
        }

        const { ad, soyad } = req.body || {};

        if (
            typeof ad !== "string" ||
            typeof soyad !== "string" ||
            !ad.trim() ||
            !soyad.trim() ||
            ad.length > 50 ||
            soyad.length > 50
        ) {
            return res.status(400).json({
                success: false,
                error: "Geçersiz form bilgisi."
            });
        }

        const mesaj =
            "Yeni form gönderimi\n\n" +
            "Ad: " + ad.trim() + "\n" +
            "Soyad: " + soyad.trim();

        const telegram = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: mesaj
                })
            }
        );

        const sonuc = await telegram.json();

        if (!telegram.ok || !sonuc.ok) {
            return res.status(502).json({
                success: false,
                error: "Telegram mesajı gönderilemedi."
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Sunucu hatası."
        });
    }
}
