const { WAConnection } = require('@adiwajshing/baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
    const conn = new WAConnection();
    
    // Generate and display the QR code in the terminal
    conn.on('qr', qr => {
        console.log("Scan this QR code with WhatsApp:");
        qrcode.generate(qr, { small: true });
    });

    // Event: When the bot is successfully connected
    conn.on('open', () => {
        console.log("Bot is connected to WhatsApp!");
        // Send a test message to a specific chat (your own number for example)
        const testNumber = "1234567890@s.whatsapp.net"; // replace with your phone number with country code
        conn.sendMessage(testNumber, "Hello from Hans Bot! Connection successful.", "conversation");
    });

    // Connect to WhatsApp
    await conn.connect();
}

startBot().catch(console.error);
