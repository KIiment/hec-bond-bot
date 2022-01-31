
# hectordao.com / hectorfinance.com bonding rate discord bot

This is a Discord Bot that tracks the 1.1 & 4.4 Bond rates and also notifies if they are good.
It also tracks the current Rebase Time and the Average Rebase time!


If you just want to checkout the Bot join my Discord!
https://discord.gg/KrbNkMyQut


## How to Setup

#### 1. Download all the Files and extract them & also install all the modules in the package.json
Open a CMD go into the Directory and run this command:
```
npm install
```

#### 2. Create a .env file in the Folder
Input your Discord Bot Token Key into the .env & also Invite the Bot to you're Discord.

```
  DISCORDJS_BOT_TOKEN= < INPUT YOUR DISCORD BOT TOKEN >
```

#### 3. Input the Discord Channel ID for the 1.1 Bonds & 4.4 Bonds.


```javascript
  const channels = {
  11: 'CHANNEL ID', // 1.1 Bond Channel ID
  44: 'CHANNEL ID', // 4.4 Bond Channel ID
  66: 'CHANNEL ID', // Rebase Channel ID
};
```

#### If you want to get Notfied you need to create 2 Roles.
#### The Bot will Ping the Role if the Bonds exceed the "goodRates" Values

Input the Role IDS into here!
```javascript
const notifyRoles = {
  11: 'ROLE ID', //1.1 Role Notifier  ID
  44: 'ROLE ID', //4.4 Role Notifier  ID
}

Input the Rate at wich you want to get Pinged here! 8.4 = 8.4%
  const goodRates = {
  11: 8.4, //1.1 Role Notifier Rate at wich it Pings the role
  44: 10, //4.4 Role Notifier Rate at wich it Pings the role
};
;
```


#### 5. After that all you need to do is run the bot with 
```
node bot.js 
```





## Authors

- [@KIiment](https://github.com/xKliment)
- [@snorkiepie](https://github.com/snorkypie/) <Big Thanks to him for helping me out!>

