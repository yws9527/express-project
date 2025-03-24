# macos11 安装mongodb

### 1. 安装
安装之前最好检查下版本兼容性, [戳这里](https://www.mongodb.com/zh-cn/docs/v6.0/administration/production-notes/#std-label-prod-notes-supported-platforms)
```shell
  1. brew tap mongodb/brew
  2. brew update
  3. brew install mongodb-community@7.0
```

### 2. 运行与停止
```shell
  # 运行
  brew services start mongodb-community@6.0

  # 停止
  brew services stop mongodb-community@6.0
```

### 3. 操作 MongoDB
要操作 MongoDB，您可以使用 MongoDB 的 shell 命令，在终端中输入各种操作数据库的命令。以下是一些常用的命令：

- show dbs：这个命令会显示当前 MongoDB 服务中存在的所有数据库的名称和大小。
- use <database>：这个命令会切换到指定的数据库，如果数据库不存在，会自动创建一个新的数据库。
- show collections：这个命令会显示当前数据库中存在的所有集合的名称，集合是 MongoDB 中存储数据的基本单位，类似于关系型数据库中的表。
- db.createCollection(<name>)：这个命令会在当前数据库中创建一个名为 <name> 的集合，如果集合已经存在，会报错。
- db.<collection>.insert(<document>)：这个命令会向指定的集合中插入一个文档，文档是 MongoDB 中存储数据的基本单位，类似于关系型数据库中的行，文档使用 JSON 格式表示，可以包含任意的键值对。
- db.<collection>.find(<query>)：这个命令会从指定的集合中查询符合条件的文档，<query> 参数是一个 JSON 对象，用于指定查询的条件，如果省略，会返回所有的文档。
- db.<collection>.update(<query>, <update>)：这个命令会更新指定的集合中符合条件的文档，<query> 参数是一个 JSON 对象，用于指定查询的条件，<update> 参数是一个 JSON 对象，用于指定更新的内容，可以使用一些特殊的操作符，如 $set，$inc，$push 等。
- db.<collection>.remove(<query>)：这个命令会删除指定的集合中符合条件的文档，<query> 参数是一个 JSON 对象，用于指定查询的条件，如果省略，会删除所有的文档。
- db.<collection>.drop()：这个命令会删除指定的集合，以及集合中的所有文档和索引。
- db.dropDatabase()：这个命令会删除当前的数据库，以及数据库中的所有集合和文档。