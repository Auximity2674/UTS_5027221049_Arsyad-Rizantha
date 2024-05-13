const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const proto = grpc.loadPackageDefinition(protoLoader.loadSync('mahasiswa.proto')).mahasiswa;

mongoose.connect('mongodb://localhost:27017/mahasiswa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
