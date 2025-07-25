<!-- src/views/CategoryBudget.vue -->
<template>
    <div class="container py-4">
        <button class="btn btn-sm btn-outline-secondary me-2" @click="$router.push({ name: 'Kategori' })">
            <i class="material-icons">arrow_back</i>
        </button>
        <h4 class="mb-4">Anggaran Kategori - {{ categoryName }}</h4>

        <div v-if="loading">Memuat data...</div>
        <div v-else>
            <div v-if="budget">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Anggaran Bulan {{ month }}/{{ year }}</h5>
                        <p class="card-text">Jumlah Anggaran: Rp {{ formatRupiah(budget.amount) }}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-warning btn-sm" @click="editMode = true">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="deleteBudget">Hapus</button>
                        </div>
                    </div>
                </div>

                <div v-if="editMode" class="card shadow-sm p-4 mb-4 border border-light rounded-4">
                    <h5 class="mb-3 d-flex align-items-center">
                        <i class="fas fa-pen-to-square me-2 text-primary"></i> Edit Anggaran
                    </h5>
                    <form @submit.prevent="updateBudget">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Jumlah (Rp)</label>
                            <div class="input-group">
                                <span class="input-group-text">Rp</span>
                                <input v-model.number="form.amount" type="number" class="form-control"
                                    placeholder="Masukkan jumlah anggaran" required />
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-secondary" type="button" @click="editMode = false">
                                <i class="fas fa-times me-1"></i> Batal
                            </button>
                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-save me-1"></i> Simpan
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            <div v-else>
                <h5>Belum ada anggaran untuk bulan ini</h5>
                <form @submit.prevent="createBudget">
                    <div class="mb-3">
                        <label class="form-label">Jumlah Anggaran (Rp)</label>
                        <input v-model.number="form.amount" type="number" class="form-control" required />
                    </div>
                    <button class="btn btn-success" type="submit">Tambah Anggaran</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'KategoriAnggaran',
    data() {
        return {
            categoryId: null,
            categoryName: '',
            categoryType: '',
            loading: false,
            budget: null,
            editMode: false,
            form: {
                amount: null,
            },
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        };
    },
    methods: {
        async fetchData() {
            this.loading = true;
            try {
                const res = await axios.get('/budgets');
                const match = res.data.budgets.find(
                    (b) =>
                        b.category === this.categoryName &&
                        b.month === this.month &&
                        b.year === this.year
                );
                if (match) {
                    this.budget = match;
                    this.form.amount = match.amount;
                } else {
                    this.budget = null;
                    this.form.amount = null;
                }
            } catch (err) {
                console.error('Gagal memuat data anggaran:', err);
            } finally {
                this.loading = false;
            }
        },

        async createBudget() {
            try {
                await axios.post('/budgets', {
                    category: this.categoryName,
                    type: 'pengeluaran',
                    amount: this.form.amount,
                    month: this.month,
                    year: this.year,
                });
                this.fetchData();
            } catch (err) {
                console.error('Gagal menambahkan anggaran:', err);
            }
        },

        async updateBudget() {
            try {
                await axios.put(`/budgets/${this.budget.id}`, {
                    amount: this.form.amount,
                });
                this.editMode = false;
                this.fetchData();
            } catch (err) {
                console.error('Gagal memperbarui anggaran:', err);
            }
        },

        async deleteBudget() {
            if (confirm('Yakin hapus anggaran ini?')) {
                try {
                    await axios.delete(`/budgets/${this.budget.id}`);
                    this.budget = null;
                    this.form.amount = 0;
                } catch (err) {
                    console.error('Gagal menghapus anggaran:', err);
                }
            }
        },

        formatRupiah(angka) {
            return angka.toLocaleString('id-ID');
        },
    },
    mounted() {
        // Ambil parameter dan query
        this.categoryId = this.$route.params.id;
        this.categoryName = this.$route.query.name || '';
        this.categoryType = this.$route.query.type || '';

        // Cek jika tidak ada nama kategori (akses langsung tanpa query), redirect
        if (!this.categoryName) {
            alert('Data kategori tidak ditemukan.');
            this.$router.push({ name: 'Kategori' });
            return;
        }

        this.fetchData();
    },
};
</script>

<style scoped>
.card {
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
