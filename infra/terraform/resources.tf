############################
# S3 buckets
############################
resource "aws_s3_bucket" "la_huella_sentiment_reports" {
  bucket = "la-huella-sentiment-reports"
}

resource "aws_s3_bucket" "la_huella_uploads" {
  bucket = "la-huella-uploads"
}

############################
# DynamoDB tables
############################
resource "aws_dynamodb_table" "la_huella_comments" {
  name         = "la-huella-comments"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "la_huella_products" {
  name         = "la-huella-products"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "la_huella_analytics" {
  name         = "la-huella-analytics"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

############################
# SQS queues
############################
resource "aws_sqs_queue" "la_huella_processing_queue" {
  name = "la-huella-processing-queue"
}

resource "aws_sqs_queue" "la_huella_notifications_queue" {
  name = "la-huella-notifications-queue"
}

############################
# CloudWatch Logs
############################
resource "aws_cloudwatch_log_group" "la_huella_aplication" {
  name = "/la-huella-aplication"
}
