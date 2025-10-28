locals {
  name_prefix = "demo-oci"
}

# VCN
resource "oci_core_vcn" "vcn" {
  compartment_id = var.compartment_ocid
  display_name   = "${local.name_prefix}-vcn"
  cidr_block     = "10.0.0.0/16"
}

resource "oci_core_internet_gateway" "igw" {
  compartment_id = var.compartment_ocid
  display_name   = "${local.name_prefix}-igw"
  vcn_id         = oci_core_vcn.vcn.id
  is_enabled     = true
}

resource "oci_core_route_table" "rt" {
  compartment_id = var.compartment_ocid
  display_name   = "${local.name_prefix}-rt"
  vcn_id         = oci_core_vcn.vcn.id

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

# Security list (ingress/egress)
resource "oci_core_security_list" "sec_list" {
  compartment_id = var.compartment_ocid
  display_name   = "${local.name_prefix}-sec-list"
  vcn_id         = oci_core_vcn.vcn.id

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
    description = "SSH"
  }

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 80
      max = 80
    }
    description = "HTTP"
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 443
      max = 443
    }
    description = "HTTPS"
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 3001
      max = 3001
    }
    description = "backend port"
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 5173
      max = 5173
    }
    description = "vite dev (if needed)"
  }

  egress_security_rules {
    protocol = "all"
    destination = "0.0.0.0/0"
  }
}

# Subnet (pública)
resource "oci_core_subnet" "subnet_public" {
  compartment_id        = var.compartment_ocid
  vcn_id                = oci_core_vcn.vcn.id
  display_name          = "${local.name_prefix}-public-subnet"
  cidr_block            = "10.0.1.0/24"
  route_table_id        = oci_core_route_table.rt.id
  security_list_ids     = [oci_core_security_list.sec_list.id]
  prohibit_public_ip_on_vnic = false
  dns_label             = "demo"
}

# Buscar la imagen de Ubuntu 22.04
data "oci_core_images" "ubuntu" {
  compartment_id = var.compartment_ocid
  # image shape and OS family filters
  operating_system = "Canonical Ubuntu"
  operating_system_version = "22.04"
  sort_by = "TIMECREATED"
  sort_order = "DESC"
}

# Boot volume / SSH key (user_data via cloud-init)
data "local_file" "cloud_init" {
  filename = "${path.module}/cloud_init.sh"
}

# Crear instancia(s)
resource "oci_core_instance" "vm" {
  count           = var.vm_count
  compartment_id  = var.compartment_ocid
  availability_domain = var.vm_ad != null ? var.vm_ad : data.oci_identity_availability_domains.ads.availability_domains[0].name
  shape           = var.vm_shape
  display_name    = "${local.name_prefix}-vm-${count.index + 1}"

  create_vnic_details {
    subnet_id = oci_core_subnet.subnet_public.id
    assign_public_ip = true
    display_name = "${local.name_prefix}-vnic-${count.index + 1}"
  }

  source_details {
    source_type = "image"
    image_id    = data.oci_core_images.ubuntu.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_authorized_key
    user_data = base64encode(data.local_file.cloud_init.content)
  }
}

# Obtener vnic de la primera instancia (para extraer la IP pública)
data "oci_core_vnic" "primary_vnic" {
  vnic_id = oci_core_instance.vm[0].primary_vnic_id
}

