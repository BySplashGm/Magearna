# Magearna 🤖

Magearna is a lightweight and modular Discord bot featuring a small set of useful commands centered around Pokémon and server utilities. It includes a Pokédex, Pokémon image generator (normal and shiny), type chart viewer, and basic tools like uptime and announcements. Designed for easy deployment and minimal configuration, Magearna is ideal for Pokémon-themed communities.

## Features ✨
- **Command Handling:** Modular command structure for easy extension.
- **Event Handling:** Listens and responds to various Discord events.
- **Automatic Command Deployment:** Slash commands are deployed automatically on startup.
- **/announcement:** Send an announcement to the server (admin only).
- **/nonshiny:** Get an image of a Pokémon in its normal form.
- **/pokedex:** Get detailed information about a Pokémon.
- **/shiny:** Get an image of a Pokémon in its shiny form.
- **/type:** View strengths and weaknesses of a Pokémon type.
- **/help:** Display the list of available commands.
- **/ping:** Show Magearna's uptime and responsiveness.

## Getting Started 🚀

### Prerequisites
- [Node.js](https://nodejs.org/)
- A Discord bot token (available on the [Discord Developer Portal](https://discord.com/developers/applications))

### Installation
Clone the repository:
```bash
git clone https://github.com/BySplashGm/Magearna.git
cd Magearna
```

Install dependencies:
```bash
npm install
```

### Environment Variables ⚙️
Create a `.env` file in the root directory with the following content:
```env
TOKEN=your-discord-bot-token
CONFIGTYPE=DEV
```
> `TOKEN` is your bot's Discord token.  
> `CONFIGTYPE` must be either `DEV` or `PROD`, depending on the environment you're using.

### Running the Bot 💻
The bot automatically deploys slash commands at startup.
```bash
npm run start
```

## Contributing 🤝
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License 📄
This project is licensed under the MIT License.

---
Crafted with ❤️ by BySplashGm

