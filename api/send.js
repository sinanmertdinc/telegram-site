
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, player, quality, years, memory } = req.body || {};

    if (
        ![name, player, quality, years, memory].every(
            value => typeof value === "string" && value.trim()
        )
    ) {
        return res.status(400).json({ error: "Lütfen tüm soruları cevaplayın." });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: "Telegram ayarları eksik." });
    }

    const message =
        "🦅 YENİ BEŞİKTAŞ ANKETİ\n\n" +
        "👤 Ad Soyad: " + name.trim() + "\n" +
        "⚽ Favori Futbolcu: " + player.trim() + "\n" +
        "🖤 Beşiktaş'ın En Büyük Özelliği: " + quality.trim() + "\n" +
        "📅 Taraftarlık Süresi: " + years.trim() + "\n" +
        "🦅 Unutulmaz Anı: " + memory.trim();

    try {
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            }
        );

        if (!telegramResponse.ok) {
            return res.status(502).json({ error: "Telegram mesajı gönderilemedi." });
        }

        return res.status(200).json({ success: true });
    } catch {
        return res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
}
