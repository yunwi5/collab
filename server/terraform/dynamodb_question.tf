resource "aws_dynamodb_table" "question_table" {
  name           = "${var.app_name}-${var.question_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "quizId"
  range_key      = "createdAt"

  attribute {
    name = "quizId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  tags = {
    Name        = var.question_table_name
    Environment = var.environment
  }
}
