
---

## 🚀 Termux + Node.js + MySQL + PM2 Setup Guide

### 1. Install Termux

- Download Termux from [F-Droid](https://f-droid.org/packages/com.termux/) (recommended) or Google Play Store.

### 2. Update & Install Essential Packages

```sh
pkg update && pkg upgrade
pkg install wget curl git nano
```

### 3. Install MySQL (MariaDB)

```sh
pkg install mariadb
```

#### Initialize and Start MySQL

```sh
mysql_install_db
mysqld_safe --datadir=/data/data/com.termux/files/usr/var/lib/mysql &
```

#### Secure MySQL & Set Root Password

```sh
mysql_secure_installation
```

#### Create a MySQL User (with access from any host)

```sql
# Enter MySQL shell
mysql -u root -p

# In the MySQL prompt, run:
CREATE USER 'youruser'@'%' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON *.* TO 'youruser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### 4. Install Node.js & npm

```sh
pkg install nodejs
```

### 5. Clone Your Project & Install Dependencies

```sh
git clone https://github.com/yourusername/yourproject.git
cd yourproject
npm install
```

### 6. Install PM2 (Process Manager)

```sh
npm install -g pm2
```

### 7. Start Your App with PM2

```sh
pm2 start app.js --name "myapp"
pm2 save
```

### 8. Enable PM2 Startup on Boot

```sh
pm2 startup
# Follow the instructions printed by pm2 to add a command to your .bashrc or .profile
```

#### Example: Add to `.bashrc`

```sh
echo 'pm2 resurrect' >> ~/.bashrc
```

### 9. Customize Termux with nano and .bashrc

- Open `.bashrc` with nano:
  ```sh
  nano ~/.bashrc
  ```
- Add aliases, environment variables, or custom greetings. Example:
  ```sh
  echo "Welcome to your cool Termux dev environment! 🚀"
  alias ll='ls -alF'
  export TZ='Africa/Mogadishu'
  ```

### 10. Useful PM2 Commands

- List processes: `pm2 list`
- Restart app: `pm2 restart myapp`
- Stop app: `pm2 stop myapp`
- View logs: `pm2 logs myapp`

---

### 11. Create and Edit Your .env File with nano

- Open (or create) your `.env` file with nano:
  ```sh
  nano .env
  ```
- Example `.env` content:
  ```env
  NODE_ENV=production
  PORT=5000
  HOST=localhost
  DB=muraad
  USER=root
  PASS=yourpassword
  TZ=Africa/Mogadishu
  ```
- Save and exit nano: Press `CTRL+O` to write, then `Enter`, then `CTRL+X` to exit.

---

## 🎉 You’re Ready!

You now have a full Node.js + MySQL stack running on your Android device with Termux, managed by PM2, and a personalized shell environment. Happy coding!

--- 
