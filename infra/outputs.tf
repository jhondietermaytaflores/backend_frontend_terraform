output "public_ip" {
  value       = oci_core_instance.vm[0].public_ip
  description = "IP pública de la instancia creada"
}

output "vm_ocids" {
  description = "OCIDs de las instancias"
  value       = [for i in oci_core_instance.vm : i.id]
}

output "subnet_id" {
  description = "Subnet utilizada por las instancias"
  value       = var.subnet_id
}
