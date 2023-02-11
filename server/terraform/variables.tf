variable "aws_region" {
  default = "ap-southeast-2"
}

variable "environment" {
  default = "development"
}

variable "app_name" {
  default = "Collab"
}

variable "iam_user_name" {
  default = "collab-app"
}

variable "image_s3_name" {
  default = "image-bucket"
}

variable "user_table_name" {
  default = "User"
}

variable "user_table_name_index" {
  default = "UserNameIndex"
}

variable "quiz_table_name" {
  default = "Quiz"
}

variable "question_table_name" {
  default = "Question"
}

variable "attempt_history_table_name" {
  default = "AttemptHistory"
}

variable "attempt_history_table_user_index" {
  default = "AttemptHistoryUserIndex"
}

variable "article_group_table_name" {
  default = "ArticleGroup"
}

variable "article_table_name" {
  default = "Article"
}

variable "article_table_creator_index" {
  default = "ArticleCreatorIndex"
}

variable "article_collaborator_table_name" {
  default = "ArticleCollaborator"
}

variable "article_collaborator_table_index" {
  default = "ArticleCollaboratorIndex"
}

variable "program_table_name" {
  default = "Program"
}

variable "program_collaborator_table_name" {
  default = "ProgramCollaborator"
}

variable "program_collaborator_table_index" {
  default = "ProgramCollaboratorIndex"
}

variable "comment_table_name" {
  default = "Comment"
}

# variable "public_subnet_cidrs" {
#   type        = list(string)
#   description = "Public Subnet CIDR values"
#   default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
# }



# variable "private_subnet_cidrs" {
#   type        = list(string)
#   description = "Private Subnet CIDR values"
#   default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
# }
