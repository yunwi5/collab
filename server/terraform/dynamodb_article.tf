resource "aws_dynamodb_table" "article_table" {
  name           = "${var.app_name}-${var.article_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "parentId" # group ID or parent article ID
  range_key      = "articleId"

  attribute {
    name = "parentId"
    type = "S"
  }

  attribute {
    name = "articleId"
    type = "S"
  }

  attribute {
    name = "creatorId"
    type = "S"
  }

  global_secondary_index {
    name               = var.article_table_creator_index
    hash_key           = "creatorId"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "INCLUDE"
    non_key_attributes = ["topic", "thumbnail", "createdAt", "icon", "tags"]
  }

  tags = {
    Name        = var.article_group_table_name
    Environment = var.environment
  }
}
