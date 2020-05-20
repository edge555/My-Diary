if(process.env.NODE_ENV=='production'){
    module.exports = {
      mongoURI:
        "mongodb+srv://admin-shoaib2:test123@mydiary2-zeh2t.mongodb.net/test?retryWrites=true&w=majority"
    };
}else{
    module.exports = { mongoURI: "mongodb://localhost/mydiary" };
}