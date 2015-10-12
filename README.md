
# Reddit Elastic Search

###FrameWorks
Node.JS
React.JS
Elastic Search
MongoDB


### Installation instructions
1) pip install -r requirements.txt
2) npm install && bower install


### Start Server
1)  start Mongo server with a replicaSet
    `mongod --dbpath <db_dir> --port <mongo_port> --replSet <replicate_set_name>`
2)  start ElasticSearch server
3)  start mongo-connector
    `mongo-connector -m localhost:<mongo_port> -t localhost:9200 -d elastic_doc_manager --auto-commit-interval=0`
4)  start server
    `gulp dev`

### Screenshot
![Search Screenshot](https://github.com/kave/reddit-search/raw/master/images/scrnShot.png "Reddit Search Screenshot")
