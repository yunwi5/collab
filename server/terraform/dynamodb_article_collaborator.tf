resource "aws_dynamodb_table" "article_collaborator_table" {
  name           = "${var.app_name}-${var.article_collaborator_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 3
  write_capacity = 3
  hash_key       = "articleId"
  range_key      = "userId"

  attribute {
    name = "articleId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = var.article_collaborator_table_index
    hash_key        = "userId"
    range_key       = "articleId"
    write_capacity  = 2
    read_capacity   = 2
    projection_type = "ALL"
  }

  tags = {
    Name        = var.article_collaborator_table_name
    Environment = var.environment
  }
}
