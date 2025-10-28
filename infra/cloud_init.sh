#!/bin/bash
# cloud_init.sh - se pasará como user_data a la instancia

# actualizar y preparar
apt-get update -y
apt-get upgrade -y

# instalar dependencias
apt-get install -y ca-certificates curl gnupg lsb-release

# instalar Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# habilitar docker
systemctl enable docker
systemctl start docker

# crear carpeta para docker-compose
mkdir -p /opt/app
chown ubuntu:ubuntu /opt/app

# firewall - permitir puertos (ufw)
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
# puertos app: ejemplo backend:3001 frontend:80 (frontend servirá en 80)
ufw allow 3001/tcp
ufw allow 5173/tcp
ufw --force enable

# add ubuntu user to docker group
usermod -aG docker ubuntu

# cleanup
apt-get autoremove -y
