---

# 🚀 Termux + Node.js + MySQL + PM2 Setup Guide

> 💻 A lightweight dev environment in your pocket!  
> This guide walks you through setting up Node.js + MariaDB + PM2 on Android using Termux & Termux:Boot.

---

## 📦 1. Install Termux & Termux:Boot

Download both from [F-Droid](https://f-droid.org/packages/com.termux/) or Google Play Store:

- **Termux**
- **Termux:Boot**

---

## ⚙️ 2. Update & Install Essentials

Run these commands in Termux:

```sh
pkg update && pkg upgrade
pkg install wget curl git nano nodejs-lts mariadb


---

🛠️ 3. MySQL (MariaDB) Setup

Start MySQL in safe mode:

mysqld_safe &

Secure MySQL:

mysql_secure_installation

Then log in and create a new user:

mysql -u root

CREATE USER 'munasar'@'%' IDENTIFIED BY 'Munasar22';
GRANT ALL PRIVILEGES ON *.* TO 'munasar'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;


---

📁 4. Project Setup

Clone your Node.js project and install dependencies:

git clone https://github.com/caaqilyare/caaqil1.git
cd caaqil1
npm install


---

🔄 5. PM2 Process Manager

Install PM2 globally and run your app:

npm install -g pm2
pm2 start npm --name muraad -- start
pm2 save


---

🔐 6. Environment Variables (.env)

Create a .env file:

nano .env

Example content:

NODE_ENV=production
PORT=5000
HOST=localhost
DB=muraad
USER=munasar
PASS=Munasar22
TZ=Africa/Mogadishu


---

🔁 7. Auto-Start on Boot (Termux:Boot)

🧱 Create boot directory:

mkdir -p ~/.termux/boot

✏️ Create startup script:

nano ~/.termux/boot/start-all.sh

Paste the following:

#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
echo "Starting MySQL safe mode..."
mysqld_safe &
sleep 10
echo "Starting PM2 resurrect..."
pm2 resurrect
echo "✅ Boot script finished."

Make it executable:

chmod +x ~/.termux/boot/start-all.sh

✅ Now reboot your phone to test the auto-start functionality.


---

🎨 8. Customize Termux Prompt

Optional: Auto-start the boot script when Termux is opened.

Edit your .bashrc:

nano ~/.bashrc

Add this at the end:

bash ~/.termux/boot/start-all.sh

You can also add aliases or messages here to personalize your Termux environment.


---

🧠 9. Useful PM2 Commands

Command	Description

pm2 list	View all running processes
pm2 restart muraad	Restart your app
pm2 stop muraad	Stop your app
pm2 logs muraad	View logs in real time



---

🎉 You're Ready to Build!

You now have a portable Node.js backend running on Android, complete with MySQL and auto-booting using PM2. Perfect for light hosting, testing APIs, or mobile devops!

> 🛡️ Developed by: Munasar
🔗 Project Repo: GitHub - caaqil1



---

✅ Now just copy everything above and paste it into your `README.md` file inside your project folder. Let me know if you want a `README.html` or PDF version too.
