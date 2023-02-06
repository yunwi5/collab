resource "aws_dax_cluster" "collab_dax" {
  cluster_name       = lower("${var.app_name}-dax-cluster")
  iam_role_arn       = aws_iam_role.collab_db_role.arn // prepare
  node_type          = "dax.r4.large"
  replication_factor = 1 // no read replicas for now
  description        = "${var.app_name} dax cluster"

  server_side_encryption {
    enabled = true
  }
}
