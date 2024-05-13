import React, { useState, useEffect } from 'react';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const MahasiswaApp = () => {
    const [mahasiswa, setMahasiswa] = useState([]);
    const [newMahasiswa, setNewMahasiswa] = useState({ NRP: '', departement: '', university: '', year: '' });

    const PROTO_PATH = './mahasiswa.proto';
    const packageDefinition = protoLoader.loadSync(PROTO_PATH);
    const mahasiswaProto = grpc.loadPackageDefinition(packageDefinition).mahasiswa;

    const client = new mahasiswaProto.MahasiswaService(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );

    const fetchMahasiswas = async () => {
        client.ListMahasiswas({}, (error, response) => {
            if (error) {
                console.error('Error fetching list data:', error);
            } else {
                setMahasiswa(response.mahasiswas);
            }
        });
    };

    const createMahasiswa = async () => {
        client.CreateMahasiswa(newMahasiswa, (error, response) => {
            if (error) {
                console.error('Error creating new mahasiswa:', error);
            } else {
                fetchMahasiswas();
                setNewMahasiswa({ NRP: '', departement: '', university: '', year: '' });
            }
        });
    };

    const deleteMahasiswa = async (id) => {
        client.DeleteMahasiswa({ id }, (error, response) => {
            if (error) {
                console.error('Error deleting mahasiswa:', error);
            } else {
                fetchMahasiswas();
            }
        });
    };

    // Mengambil data mahasiswa saat komponen di-mount
    useEffect(() => {
        fetchMahasiswas();
    }, []);

    return (
        <div>
            <h1>Sistem Pendataan Akun Mahasiswa</h1>
            <div>
                <h2>Data Mahasiswa</h2>
                <ul>
                    {mahasiswa.map((mahasiswa) => (
                        <li key={mahasiswa.id}>
                            {mahasiswa.NRP} - {mahasiswa.departement} - {mahasiswa.university} ({mahasiswa.year})
                            <button onClick={() => deleteMahasiswa(mahasiswa.id)}>Hapus</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Tambah Mahasiswa Baru</h2>
                <input
                    type="text"
                    placeholder="Nomor NRP"
                    value={newMahasiswa.NRP}
                    onChange={(e) => setNewMahasiswa({ ...newMahasiswa, NRP: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Asal Departemen"
                    value={newMahasiswa.departement}
                    onChange={(e) => setNewMahasiswa({ ...newMahasiswa, departement: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Universitas"
                    value={newMahasiswa.model}
                    onChange={(e) => setNewMahasiswa({ ...newMahasiswa, university: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Tahun Masuk"
                    value={newMahasiswa.year}
                    onChange={(e) => setNewMahasiswa({ ...newMahasiswa, year: e.target.value })}
                />
                <button onClick={createMahasiswa}>Tambah Data</button>
            </div>
        </div>
    );
};

export default MahasiswaApp;