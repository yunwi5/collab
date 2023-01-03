resource "aws_dynamodb_table" "article_group_table" {
  name           = "${var.app_name}-${var.article_group_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "creatorId"
  range_key      = "groupId"

  attribute {
    name = "creatorId"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  tags = {
    Name        = var.article_group_table_name
    Environment = var.environment
  }
}
