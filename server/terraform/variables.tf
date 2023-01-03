variable "aws_region" {
  default = "ap-southeast-2"
}

variable "environment" {
  default = "development"
}

variable "app_name" {
  default = "Collab"
}

variable "user_table_name" {
  default = "User"
}

variable "user_table_index_name" {
  default = "UserIndex"
}

variable "quiz_table_name" {
  default = "Quiz"
}
