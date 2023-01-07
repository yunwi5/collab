locals {
  image_s3_bucket = "${lower(var.app_name)}-${var.image_s3_name}"
}

resource "aws_s3_bucket" "image_s3" {
  bucket = local.image_s3_bucket

  tags = {
    Name        = "${var.app_name} S3 bucket"
    Description = "${var.app_name} S3 bucket for storing user uploaded images"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.image_s3.id
  acl    = "public-read"
}
