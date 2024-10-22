const mobileBreakpoint = 670;

// Login Credentials (in encrypted form)
const credentials = {
    username: 'dGF4ZXJyYWN0IGdsb2Jl', // Base64 encoded: taxerract globe
    password: 'YWRtaW4=' // Base64 encoded: admin
};

function setDeviceClass(isMobile) {
    if (isMobile) {
        document.body.classList.add('unsupported-device');
    } else {
        document.body.classList.remove('unsupported-device');
    }
}

function checkDevice() {
    const isMobile = window.innerWidth < mobileBreakpoint;
    setDeviceClass(isMobile);
}

window.addEventListener('load', checkDevice);
window.addEventListener('resize', checkDevice);


    let isFormatChanged = false; // Menyimpan status perubahan format
    let csvData = []; // Menyimpan data dari CSV
    let displayedData = []; // Menyimpan data yang ditampilkan
    let sentStatus = []; // Menyimpan status pengiriman untuk setiap baris
    let currentEditIndex = -1; // Menyimpan index client yang sedang diedit

    document.getElementById('csvFile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const rows = text.split('\n').map(row => row.split(','));
                csvData = rows.slice(1); 
                sentStatus = new Array(csvData.length).fill(false); 
                displayData(); 
                document.getElementById('messageFormat').disabled = true; 
                document.getElementById('editFormat').style.display = 'inline-block'; 
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('filterSelect').addEventListener('change', displayData);

    function displayData() {
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = ''; 
        let hasData = false;
        const messageFormat = document.getElementById('messageFormat').value;
        let clientCount = 0; 

        const filter = document.getElementById('filterSelect').value;

        csvData.forEach((row, index) => {
            if (index === 0 || row.length < 3) return; 

            const name = row[0].trim(); 
            const phone = row[1].trim(); 
            const link = row[2].trim(); 
            const isSent = sentStatus[index];

            if (
                (filter === 'sent' && !isSent) || 
                (filter === 'notSent' && isSent) || 
                (filter === 'noName' && name) || 
                (filter === 'noPhone' && phone) || 
                (filter === 'noLink' && link)
            ) {
                return; 
            }

            const formattedMessage = messageFormat.replace('{1}', name).replace('{2}', link);
            const whatsappLink = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(formattedMessage)}`;

            const item = document.createElement('div');
            item.className = 'data-item';

            const info = document.createElement('div');
            info.className = 'data-info';
            info.innerHTML = `<strong>${name || 'Tidak ada Nama'}</strong><br>${phone || 'Tidak ada No.Telp'}<br>${link || 'Tidak ada Link Data'}`;

            const button = document.createElement('button');
            button.innerText = 'Kirim Pesan';
            button.onclick = () => {
                window.open(whatsappLink, '_blank');
                item.classList.add('clicked'); 
                sentStatus[index] = true; 
                displayData(); 
            };

            const editButton = document.createElement('button');
            editButton.innerText = 'Edit Data';
            editButton.onclick = () => {
                openEditModal(index);
            };

            item.appendChild(info);
            item.appendChild(button);
            item.appendChild(editButton);
            dataList.appendChild(item);
            hasData = true;
            clientCount++; 
        });

        if (!hasData) {
            dataList.innerHTML = 'Tidak ada data untuk ditampilkan.';
        }

        document.getElementById('clientCount').innerText = `${clientCount} Client`; 
    }

    function openEditModal(index) {
        currentEditIndex = index; 
        const row = csvData[index];
        document.getElementById('editName').value = row[0];
        document.getElementById('editPhone').value = row[1];
        document.getElementById('editLink').value = row[2];
        document.getElementById('editModal').style.display = 'block';
    }

    document.getElementById('saveChanges').onclick = function() {
        const name = document.getElementById('editName').value;
        const phone = document.getElementById('editPhone').value;
        const link = document.getElementById('editLink').value;

        csvData[currentEditIndex] = [name, phone, link]; 
        sentStatus[currentEditIndex] = false; // Reset status pengiriman
        displayData(); 
        document.getElementById('editModal').style.display = 'none'; 
    };

    document.getElementById('cancelEdit').onclick = function() {
        document.getElementById('editModal').style.display = 'none';
    };

    // Fitur untuk mengubah format pesan
    document.getElementById('editFormat').addEventListener('click', function() {
        const messageFormat = document.getElementById('messageFormat');
        messageFormat.disabled = !messageFormat.disabled; // Toggle disabled state
        this.innerText = messageFormat.disabled ? 'Ubah Format' : 'Selesai Mengubah'; // Ubah teks tombol

        if (messageFormat.disabled && isFormatChanged) {
            sentStatus.fill(false); // Set semua status pengiriman menjadi false
            displayData(); // Generate ulang link
            isFormatChanged = false; // Reset status perubahan
        } else if (!messageFormat.disabled) {
            isFormatChanged = true; // Menandai bahwa format telah diubah
        }
    });

    // Fitur untuk membuka dan menutup modal
    const userManualBtn = document.getElementById('userManualBtn');
    const modal = document.getElementById('userManualModal');
    const closeBtn = document.querySelector('.close');

    userManualBtn.onclick = function() {
        modal.style.display = 'block'; // Tampilkan modal
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none'; // Sembunyikan modal
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Sembunyikan modal jika di klik di luar modal
        }
    }

    // Modal untuk edit data
    const closeEditBtn = document.querySelector('.close-edit');
    closeEditBtn.onclick = function() {
        document.getElementById('editModal').style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === document.getElementById('editModal')) {
            document.getElementById('editModal').style.display = 'none';
		} else if (event.target === modal) { // Modal user manual
        modal.style.display = 'none'; // Tutup modal user manual jika di luar modal
        }
    }
	
		document.getElementById('exportDataBtn').onclick = function() {
			exportToExcel();
		};

		function exportToExcel() {
			const workbook = XLSX.utils.book_new();
			const worksheetData = [];

			// Baris pertama: Judul
			worksheetData.push(["EXPORT DATA REQUEST CLIENT TAXERRACT GLOBE"]);
			worksheetData.push([]); // Baris kedua: Jeda
			worksheetData.push([`Waktu Ekspor: ${new Date().toLocaleString()}`]); // Baris ketiga: Waktu ekspor
			worksheetData.push([]); // Baris keempat: Jeda
			worksheetData.push(["Nama Client", "Nomor Telepon", "Link Data", "Status Pengiriman"]); // Header tabel

			// Mengambil data yang ditampilkan
			csvData.forEach((row, index) => {
				if (index === 0 || row.length < 3) return;
				const name = row[0].trim();
				const phone = row[1].trim();
				const link = row[2].trim();
				const status = sentStatus[index] ? 'Sudah' : 'Belum';
				worksheetData.push([name, phone, link, status]);
			});

			const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

			// Atur gaya untuk baris pertama (judul)
			worksheet['A1'].s = {
				font: { name: 'Bahnschrift', sz: 20, bold: true },
				alignment: { horizontal: 'center' } // Pusatkan tulisan
			};

			// Atur gaya untuk baris ketiga (waktu ekspor)
			worksheet['A3'].s = {
				alignment: { horizontal: 'left' }
			};

			// Set lebar kolom agar sesuai dengan isi
			const colWidths = [
				{ wch: 30 }, // Lebar untuk nama client
				{ wch: 20 }, // Lebar untuk nomor telepon
				{ wch: 80 }, // Lebar untuk link data
				{ wch: 20 }  // Lebar untuk status pengiriman
			];
			worksheet['!cols'] = colWidths;

			// Tambahkan border pada tabel
			const range = XLSX.utils.decode_range(worksheet['!ref']);
			for (let row = range.s.r; row <= range.e.r; row++) {
				for (let col = range.s.c; col <= range.e.c; col++) {
					const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
					if (!cell) continue; // Jika tidak ada sel, lanjutkan
					cell.s = {
						border: {
							top: { style: 'thin' },
							bottom: { style: 'thin' },
							left: { style: 'thin' },
							right: { style: 'thin' }
						}
					};
				}
			}

			// Tambahkan border spesifik untuk header tabel
			const headerRange = XLSX.utils.decode_range(`A7:D7`);
			for (let row = headerRange.s.r; row <= headerRange.e.r; row++) {
				for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
					const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
					if (cell) {
						cell.s = {
							border: {
								top: { style: 'thin' },
								bottom: { style: 'thin' },
								left: { style: 'thin' },
								right: { style: 'thin' }
							},
							fill: { fgColor: { rgb: "D3D3D3" } } // Gaya latar belakang untuk header
						};
					}
				}
			}

			// Tambahkan filter ke kolom header
			worksheet['!autofilter'] = { ref: `A5:D${worksheetData.length + 5}` }; // Memperbarui referensi filter untuk dimulai dari baris header tabel

			// Tambahkan worksheet ke workbook
			XLSX.utils.book_append_sheet(workbook, worksheet, "Data Client");

			// Simpan file Excel
			XLSX.writeFile(workbook, 'data_client.xlsx');
		}   
		document.getElementById('dataRequestBtn10').onclick = function() {
			console.log("Data Request clicked");
			document.getElementById('contentPanel').style.display = 'block';
			document.getElementById('userManualPanel10').style.display = 'none';
		};

		document.getElementById('userManualBtn10').onclick = function() {
			console.log("User Manual clicked");
			document.getElementById('contentPanel').style.display = 'none';
			document.getElementById('userManualPanel10').style.display = 'block';
		};
