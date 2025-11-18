#!/bin/bash
# cloud_init.sh
set -e  

# 1. Actualizar repositorios (evita upgrade completo si quieres velocidad, pero es seguro dejarlo)
sudo apt-get update -y
# sudo apt-get upgrade -y  <-- Opcional: esto demora mucho el inicio. Descomentar si es crítico.

# 2. Instalar dependencias previas
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw

# 3. Instalar Docker (Official Repo)
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Configurar usuario y permisos
sudo usermod -aG docker ubuntu
sudo mkdir -p /home/ubuntu/app
sudo chown -R ubuntu:ubuntu /home/ubuntu/app

# 5. Firewall (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 5173/tcp
sudo ufw --force enable

# 6. Habilitar servicio
sudo systemctl enable docker
sudo systemctl start docker

# 7. CRUCIAL: Crear archivo "señuelo" para indicar que terminamos
touch /home/ubuntu/cloud_init_finished
echo "Cloud Init Finalizado Exitosamente"