termux_setup:
  install_apps:
    - Termux from: "https://f-droid.org/packages/com.termux/"
    - Termux:Boot from: "https://f-droid.org/packages/com.termux.boot/"
  install_essentials:
    - pkg update && pkg upgrade
    - pkg install wget curl git nano nodejs-lts mariadb
  mysql_setup:
    - command: mysqld_safe &
    - secure_command: mysql_secure_installation
    - sql_commands:
        - CREATE USER 'munasar'@'%' IDENTIFIED BY 'Munasar22';
        - GRANT ALL PRIVILEGES ON *.* TO 'munasar'@'%' WITH GRANT OPTION;
        - FLUSH PRIVILEGES;
  node_project:
    git_clone: https://github.com/caaqilyare/caaqil1.git
    steps:
      - cd caaqil1
      - npm install
  pm2_setup:
    - npm install -g pm2
    - pm2 start npm --name muraad -- start
    - pm2 save
  env_file:
    path: .env
    content:
      NODE_ENV: production
      PORT: 5000
      HOST: localhost
      DB: muraad
      USER: munasar
      PASS: Munasar22
      TZ: Africa/Mogadishu
  auto_start_boot:
    boot_dir: ~/.termux/boot
    script_path: ~/.termux/boot/start-all.sh
    script_content: |
      #!/data/data/com.termux/files/usr/bin/bash
      termux-wake-lock
      echo "Starting MySQL safe mode..."
      mysqld_safe &
      sleep 10
      echo "Starting PM2 resurrect..."
      pm2 resurrect
  customization:
    bashrc_path: ~/.bashrc
    append: bash ~/.termux/boot/start-all.sh
  pm2_commands:
    - pm2 list
    - pm2 restart myapp
    - pm2 stop myapp
    - pm2 logs myapp
