---
## 🚀 Termux + Node.js + MySQL + PM2 Setup Guide

### 1. Install Termux & Termux:Boot
- Download Termux and Termux:Boot from [F-Droid](https://f-droid.org/packages/com.termux/) or Google Play Store.

### 2. Update & Install Essentials
```sh
pkg update && pkg upgrade
pkg install wget curl git nano nodejs mariadb
```

### 3. MySQL (MariaDB) Setup
```sh
mysql_install_db
mysqld_safe --datadir=/data/data/com.termux/files/usr/var/lib/mysql &
```
- Secure MySQL: `mysql_secure_installation`
- Create user:
```sql
mysql -u root -p
CREATE USER 'munasar'@'%' IDENTIFIED BY 'Munasar22';
GRANT ALL PRIVILEGES ON *.* TO 'munasar'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### 4. Project Setup

```sh
git clone https://github.com/caaqilyare/caaqil1.git
cd caaqil1
npm install
```

### 5. PM2 Process Manager
```sh
npm install -g pm2
pm2 start app.js --name "myapp"
pm2 save
```

### 6. Environment Variables (.env)
Create `.env` with:
```sh
nano .env
```
Example content:
```env
NODE_ENV=production
PORT=5000
HOST=localhost
DB=muraad
USER=munasar
PASS=Munasar22
TZ=Africa/Mogadishu
```

### 7. Auto-Start on Boot
1. Create boot script directory:
   ```sh
   mkdir -p ~/.termux/boot
   ```
2. Create script:
   ```sh
   nano ~/.termux/boot/start-all.sh
   ```
3. Paste:
   ```bash
   #!/data/data/com.termux/files/usr/bin/bash
   termux-wake-lock
   echo "Starting MySQL safe mode..."
   mysqld_safe &
   echo "Waiting 10 seconds for MySQL to start..."
   sleep 10
   echo "Starting PM2 resurrect..."
   pm2 resurrect
   echo "Boot script finished."
   ```
4. Make executable:
   ```sh
   chmod +x ~/.termux/boot/start-all.sh
   ```
5. Reboot to test.

### 8. Customize Termux
- Edit `.bashrc` for aliases, greetings, etc.:
  ```sh
  nano ~/.bashrc
  ```
  Example:
  ```sh
  echo "Welcome to your cool Termux dev environment! 🚀"
  alias ll='ls -alF'
  export TZ='Africa/Mogadishu'
  ```

### 9. Useful PM2 Commands
- List: `pm2 list`
- Restart: `pm2 restart myapp`
- Stop: `pm2 stop myapp`
- Logs: `pm2 logs myapp`

---

**GitHub:** [caaqilyare](https://github.com/caaqilyare)  
**MySQL User:** `munasar`  
**MySQL Password:** `Munasar22`

---

🎉 You now have a powerful Node.js + MySQL stack on Android with Termux, PM2, and auto-boot! Happy coding!

--- 
