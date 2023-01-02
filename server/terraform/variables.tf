variable "aws_region" {
  default = "ap-southeast-2"
}

# export TF_VAR_aws_access_key="<value>"
variable "aws_access_key" {
  default = ""
  type    = string
  description = "This is the aws access key input provided by an env variable."
}

# export TF_VAR_aws_secret_key="<value>"
variable "aws_secret_key" {
  default = ""
  type    = string
  description = "This is the aws secret key input provided by an env variable."
}
