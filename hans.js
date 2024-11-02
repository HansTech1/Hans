const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    // Create a new WhatsApp connection
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Save the authentication state
    sock.ev.on('creds.update', saveState);

    // Event: When the bot is successfully connected
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('✅ Bot is connected to WhatsApp!');

            // Send a test message to a specific chat (replace with your own WhatsApp number)
            const testNumber = '1234567890@s.whatsapp.net'; // replace with your phone number including country code
            sock.sendMessage(testNumber, { text: 'Hello from Hans Bot! Connection successful.' });
        } else if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 401;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        }
    });

    // Show QR code in terminal if needed
    sock.ev.on('qr', qr => {
        console.log('Scan the QR code with WhatsApp:');
        qrcode.generate(qr, { small: true });
    });
}

// Start the bot
startBot().catch(console.error);
