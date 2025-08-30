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

## ✅ Step 4: Set Up phpMyAdmin

1. Navigate to phpMyAdmin directory:


```sh
cd $PREFIX/share/phpmyadmin
```

2. Configure phpMyAdmin:


```sh
nano config.inc.php
```

Add or edit:

$cfg['Servers'][$i]['port'] = 3306;
$cfg['Servers'][$i]['AllowNoPassword'] = true;

3. Start PHP server for phpMyAdmin:


```sh
php -d error_reporting=22527 -S localhost:8088 -t $PREFIX/share/phpmyadmin/
```

Access phpMyAdmin at: 

```sh
http://localhost:8088/
```



Deprecation warnings may appear, but phpMyAdmin will still work.

---

## ✅ Step 5: Clone and Set Up Project

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

## ✅ Step 6: Create .env File

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

## ✅ Step 7: Install PM2 and Start App

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


## ✅ Step 8: Setup Auto-Start on Boot

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

## ✅ Step 9: Optional - Auto Start in .bashrc

```sh
nano ~/.bashrc
```

Add this line:

```sh
bash ~/.termux/boot/start-all.sh
```

---

## ✅ Step 10: PM2 Command Reference

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
