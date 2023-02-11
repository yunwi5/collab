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

variable "article_group_creator_index" {
  default = "ArticleGroupCreatorIndex"
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
