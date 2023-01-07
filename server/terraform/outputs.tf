output "user_table_arn" {
  value       = aws_dynamodb_table.user_table.arn
  description = "AWS resource name of the user table."
}

output "quiz_table_arn" {
  value       = aws_dynamodb_table.quiz_table.arn
  description = "AWS resource name of the quiz table."
}

output "question_table_arn" {
  value       = aws_dynamodb_table.question_table.arn
  description = "AWS resource name of the question table."
}

output "attempt_history_table_arn" {
  value       = aws_dynamodb_table.attempt_history_table.arn
  description = "AWS resource name of the quiz attempt history table."
}

output "article_group_table_arn" {
  value       = aws_dynamodb_table.article_group_table.arn
  description = "AWS resource name of the article group table."
}

output "article_table_arn" {
  value       = aws_dynamodb_table.article_table.arn
  description = "AWS resource name of the article table."
}

output "article_collaborator_table_arn" {
  value       = aws_dynamodb_table.article_collaborator_table.arn
  description = "AWS resource name of the article collaborator table."
}

output "program_table_arn" {
  value       = aws_dynamodb_table.program_table.arn
  description = "AWS resource name of the program table."

}

output "program_collaborator_table_arn" {
  value       = aws_dynamodb_table.program_collaborator_table.arn
  description = "AWS resource name of the program collaborator table."
}

output "comment_table_arn" {
  value       = aws_dynamodb_table.comment_table.arn
  description = "AWS resource name of the comment table."
}

output "s3_bucket_arn" {
  value       = aws_s3_bucket.image_s3.arn
  description = "AWS resource name of the image uploading bucket"
}
