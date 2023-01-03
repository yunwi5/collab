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

variable "user_table_name_index" {
  default = "UserIndex"
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
  default = "AttemptHistoryIndex"
}

variable "article_group_table_name" {
  default = "ArticleGroup"
}
