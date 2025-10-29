#!/bin/bash
# cloud_init.sh - se pasará como user_data a la instancia

# actualizar y preparar
sudo apt-get update -y
sudo apt-get upgrade -y

# instalar dependencias
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# instalar Docker
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Añadir el usuario por defecto (ubuntu) al grupo docker para evitar usar sudo
# El usuario en la imagen de Ubuntu en OCI suele ser 'ubuntu' o el que uses.
# Asumo 'ubuntu'
if id -u ubuntu >/dev/null 2>&1; then
    sudo usermod -aG docker ubuntu
else
    # Si el usuario es distinto, identifica al usuario principal de la instancia.
    echo "Usuario 'ubuntu' no encontrado, ajusta el script si usas otro usuario."
fi

# 4. Habilitar y arrancar el servicio Docker
sudo systemctl enable docker
sudo systemctl start docker

echo "Docker y Docker Compose (plugin) instalados y listos."

# crear carpeta para docker-compose
sudo mkdir -p /opt/app
sudo chown ubuntu:ubuntu /opt/app

# firewall - permitir puertos (ufw)
sudo apt-get install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# puertos app: ejemplo backend:3001 frontend:80 (frontend servirá en 80)
sudo ufw allow 3001/tcp
sudo ufw allow 5173/tcp
sudo ufw --force enable

# add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# cleanup
sudo apt-get autoremove -y
