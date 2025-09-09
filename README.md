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
pkg install wget curl git nano nodejs-lts php phpmyadmin mariadb
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
USER=root
PASS=
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


install  figlet and lolcat

```sh
pkg install ruby figlet termux-api -y
```

```sh
gem install lolcat
```

Then paste into script:

```bash
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
sshd

# Midabyo iyo styles
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
CYAN=$(tput setaf 6)
RESET=$(tput sgr0)
BOLD=$(tput bold)

line() {
  echo "${CYAN}========================================${RESET}"
}

log_step() {
  echo "[$(date '+%H:%M:%S')] ${YELLOW}➡️${RESET} $1"
}

log_ok() {
  echo "[$(date '+%H:%M:%S')] ${GREEN}✅${RESET} $1"
}

progress() {
  for i in $(seq 1 $1); do
    echo -n "."
    sleep 0.5
  done
  echo ""
}

# Hubinta wake-lock
check_wakelock() {
  if termux-wake-status | grep -q "Held"; then
    log_ok "Wake-lock wuu socdaa"
  else
    log_step "Wake-lock lama helin, hadda waa la daarayaa..."
    termux-wake-lock
    log_ok "Wake-lock waa la daaray"
  fi
}

clear
# Banner weyn oo Muraad ah
figlet -f slant "Muraad" | lolcat
echo "${BOLD}${CYAN}🚀 Muraad App ayaa la bilaabay${RESET}"
line

# Step 1 - Database (hal mar)
log_step "Database ♻️"
mysqld_safe >/dev/null 2>&1 &
progress 5
log_ok "Database ✅️"

line
# Step 2 - PM2 Resurrect (hal mar)
log_step "Muraad App ♻️"
pm2 resurrect >/dev/null 2>&1 &
progress 6
log_ok "Muraad App ✅️"

line
# Step 3 - Final status
log_ok "🔥 Muraad app is Runing ✅️"
echo "${BOLD}${GREEN}✨ Muraad App  ✨${RESET}"
echo "${BOLD}${CYAN}By Munasar $(date '+%Y'), 615050435${RESET}"
line

# Monitor loop - Hubinta wake-lock kaliya 30s kasta
while true; do
  sleep 30
  log_step "Hubinta wake-lock..."
  check_wakelock
  line
done

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

