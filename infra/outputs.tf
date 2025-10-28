output "public_ip" {
  value = data.oci_core_vnic.primary_vnic.public_ip
  description = "IP pública de la VM (primera)."
}

output "vm_ocids" {
  value = [for i in oci_core_instance.vm : i.id]
}

output "subnet_id" {
  value = oci_core_subnet.subnet_public.id
}
