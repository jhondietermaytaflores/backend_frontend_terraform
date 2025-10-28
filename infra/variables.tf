variable "tenancy_ocid" {
  description = "The OCID of the tenancy."
  type        = string
}
variable "user_ocid" {
  description = "The OCID of the user."
  type        = string
}
variable "fingerprint" {}
variable "private_key_path" { }
variable "region" {}

variable "compartment_ocid" {}
variable "subnet_id" {}
variable "availability_domain" {}

variable "ubuntu_2204_image_ocid" {
  description = "The OCID of the Ubuntu 22.04 image."
}

variable "ssh_authorized_key" {
  description = "The SSH public key for accessing the instance."
} 

variable "vm_shape" { type = string default = "VM.Standard.E2.1.Micro" }
variable "vm_ad" { type = string default = null }
variable "vm_count" { type = number default = 1 } 

variable "dockerhub_frontend_image" { type = string default = "jhonmayta/frontend:latest" }
variable "dockerhub_backend_image" { type = string default = "jhonmayta/backend:latest" }
