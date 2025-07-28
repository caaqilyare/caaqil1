# 🚀 Termux + Node.js + MySQL + PM2 Setup Guide

This is a complete instruction guide to set up a portable Node.js + MySQL backend using Termux on Android.

---

## ✅ Step 1: Install Termux & Termux:Boot

1. Download **Termux** and **Termux:Boot** from:
   - [F-Droid](https://f-droid.org/packages/com.termux/)
   - Or Google Play Store

---

## ✅ Step 2: Update Termux & Install Packages

Open Termux and run:

```sh
pkg update && pkg upgrade
```

```sh
pkg install wget curl git nano nodejs-lts mariadb
```

---

## ✅ Step 3: Start MySQL Server

```sh
mysqld_safe &
```

Then create a new MySQL user:

```sh
mysql -u root -p
```

```sql
CREATE USER 'munasar'@'%' IDENTIFIED BY 'Munasar22';
GRANT ALL PRIVILEGES ON *.* TO 'munasar'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

---

## ✅ Step 4: Clone and Set Up Project

```sh
git clone https://github.com/caaqilyare/caaqil1.git
```

```sh
cd caaqil1
```

```sh
npm install
```

---

## ✅ Step 5: Create .env File

```sh
nano .env
```

Paste:

```env
NODE_ENV=production
PORT=5000
HOST=localhost
DB=muraad
USER=munasar
PASS=Munasar22
TZ=Africa/Mogadishu
```

---

## ✅ Step 6: Install PM2 and Start App

```sh
npm install -g pm2
```

```sh
pm2 start npm --name muraad -- start
```

```sh
pm2 save
```

---


## ✅ Step 7: Setup Auto-Start on Boot

Create boot directory and script:

```sh
mkdir -p ~/.termux/boot
```

```sh
nano ~/.termux/boot/start-all.sh
```

Paste into script:

```bash
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
echo "Starting MySQL safe mode..."
mysqld_safe &
sleep 10
echo "Starting PM2 resurrect..."
pm2 resurrect
echo "✅ Boot script finished."
```

Make it executable:

```sh
chmod +x ~/.termux/boot/start-all.sh
```

---

## ✅ Step 8: Optional - Auto Start in .bashrc

```sh
nano ~/.bashrc
```

Add this line:

```sh
bash ~/.termux/boot/start-all.sh
```

---

## ✅ Step 9: PM2 Command Reference

| Command              | Description                |
|----------------------|----------------------------|
| `pm2 list`           | List running apps          |
| `pm2 restart muraad` | Restart your app           |
| `pm2 stop muraad`    | Stop the app               |
| `pm2 logs muraad`    | View real-time logs        |

---

## 🎉 Setup Complete!

You now have a fully working mobile backend stack with:

- Node.js App
- MySQL (MariaDB)
- Auto-boot support
- PM2 Process Manager

> 👨‍💻 By: **Munasar** | 🌐 Repo: [github.com/caaqilyare/caaqil1](https://github.com/caaqilyare/caaqil1)
"""

# Save the file as a markdown
md_path = Path("/mnt/data/termux-node-mysql-setup.md")
md_path.write_text(instruction_md)

md_path.name
