if(process.env.NODE_ENV=='production'){
    module.exports = {
      mongoURI:
        "mongodb+srv://admin-shoaib:test123@mydiary-vrxdk.mongodb.net/test?retryWrites=true&w=majority",
    };
}else{
    module.exports = { mongoURI: "mongodb://localhost/mydiary" };
}