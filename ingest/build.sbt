name := "ingest"
scalaVersion := Version.scala
javaOptions += "-Xmx8G"

fork in run := true

connectInput in run := true

libraryDependencies ++= Seq(
  "com.azavea" %% "scala-landsat-util" % "0.2.0-32180dc",
  "com.azavea.geotrellis" %% "geotrellis-spark" % Version.geotrellis,
  "com.azavea.geotrellis" %% "geotrellis-s3" % Version.geotrellis,
  "com.azavea.geotrellis" %% "geotrellis-accumulo" % Version.geotrellis,
  "org.apache.spark" %% "spark-core" % "1.5.2" % "provided",
  "com.github.scopt" %% "scopt" % "3.3.0",
  "org.scalatest"       %%  "scalatest"      % "2.2.0" % "test"
)

assemblyMergeStrategy in assembly := {
  case "reference.conf" => MergeStrategy.concat
  case "application.conf" => MergeStrategy.concat
  case "META-INF/MANIFEST.MF" => MergeStrategy.discard
  case "META-INF\\MANIFEST.MF" => MergeStrategy.discard
  case "META-INF/ECLIPSEF.RSA" => MergeStrategy.discard
  case "META-INF/ECLIPSEF.SF" => MergeStrategy.discard
  case _ => MergeStrategy.first
}

