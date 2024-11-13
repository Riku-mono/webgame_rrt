# webgame_rrt

## Getting Started

仮想環境は [rsl-webgame](https://github.com/recsyslab/webgame/tree/main) を使用

仮想環境を開始
```bash
$ source ~/venv/rsl-webgame/bin/activate
```

## データベース環境の構築

```bash
$ sudo -u postgres psql
```

Database の作成
```pgsql
postgres=# CREATE DATABASE webgame_rrt ENCODING 'UTF8';
CREATE DATABASE
```

Database の確認
```pgsql
postgres=# \l
                              List of databases
    Name     |  Owner   | Encoding | Collate |  Ctype  |   Access privileges
-------------+----------+----------+---------+---------+-----------------------
...（略）...
 webgame_rrt | postgres | UTF8     | C.UTF-8 | C.UTF-8 |
...（略）...
```

`webgame_rrt` に接続
```pgsql
postgres=# \c webgame_rrt
You are now connected to database "webgame_rrt" as user "postgres".
```

プロジェクトのルートに環境変数ファイルを作成
```bash
$ touch .env
```

ライブラリのインストール
```bash
(rsl-webgame) $ pip install django-environ
```

```txt:~/.env
DB_USER=YOUR_DATABASE_USER_NAME
DB_PASSWORD=YOUR_DATABASE_USER_PASSWORD
```