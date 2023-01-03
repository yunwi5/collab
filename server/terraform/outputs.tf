output "user_table_arn" {
    value = aws_dynamodb_table.user_table.arn
    description = "The AWS resource name of the user table."
}

output "quiz_table_arn" {
    value = aws_dynamodb_table.quiz_table.arn
    description = "The AWS resource name of the quiz table."
}
